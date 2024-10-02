export default {
  membersList(state, payload) {
    state.membersList = payload;
  },
  editMemberData(state, payload) {
    state.editMemberData.push(payload);
  },
  clearEditMember(state) {
    state.editMemberData = [];
  },
};
