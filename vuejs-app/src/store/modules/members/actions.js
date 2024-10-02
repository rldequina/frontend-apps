import CONFIGDATA from '../../../configData.json';
import authStore from '../../index.js';

export default {
  async loadMembersList(context) {
    const token = context.rootGetters.token;

    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/members.json?auth=${token}`
    );

    const responseData = await response.json();

    authStore.dispatch('handleError', response);

    const members = [];

    for (const key in responseData) {
      const member = {
        id: key,
        name: responseData[key].name,
        sex: responseData[key].sex,
        birthday: responseData[key].birthday,
        occupation: responseData[key].occupation,
        phone: responseData[key].phone,
        email: responseData[key].email,
        interest: responseData[key].interest,
      };

      if (responseData[key].birthday) {
        const date = new Date(responseData[key].birthday);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`;
        member.birthday = formattedDate;
      }

      members.unshift(member);
    }

    context.commit('membersList', members);
  },
  async fetchEditMemberData(context, memberId) {
    const token = context.rootGetters.token;

    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/members/${memberId}.json?auth=${token}`
    );

    const responseData = await response.json();

    authStore.dispatch('handleError', response);

    return responseData;
  },
  async editMember(context, newMemberData) {
    // check if all data has value
    const checker = Object.keys(newMemberData).map(
      (item) => newMemberData[item] != ''
    );

    if (!checker.includes(false)) {
      const response = await fetch(
        `${CONFIGDATA.FIREBASE_URL}/members/${newMemberData.id}.json?auth=${context.rootGetters.token}`,
        {
          method: 'PUT',
          body: JSON.stringify(newMemberData),
        }
      );

      authStore.dispatch('handleError', response);
    }
  },
  async addMember(context, data) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/members.json?auth=${context.rootGetters.token}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    authStore.dispatch('handleError', response);
  },
  async deleteMember(context, memberId) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/members/${memberId}.json?auth=${context.rootGetters.token}`,
      {
        method: 'DELETE',
      }
    );

    authStore.dispatch('handleError', response);
  },
};
