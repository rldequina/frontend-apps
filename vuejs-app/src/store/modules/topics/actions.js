import CONFIGDATA from '../../../configData.json';
import authStore from '../../index.js';

export default {
  async loadTopicsList(context) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics.json?auth=${context.rootGetters.token}`
    );

    const responseData = await response.json();

    authStore.dispatch('handleError', response);

    const topics = [];

    for (const key in responseData) {
      const topic = {
        id: key,
        title: responseData[key].title,
        content: responseData[key].content,
        likes: responseData[key].likes
          ? Object.keys(responseData[key].likes).length
          : 0,
        comments: responseData[key].comments
          ? Object.keys(responseData[key].comments).length
          : 0,
        createdBy: responseData[key].createdBy,
        dateCreated: responseData[key].dateCreated,
      };

      if (responseData[key].likes) {
        if (
          Object.keys(responseData[key].likes).includes(
            authStore.getters['user']
          )
        ) {
          topic['hasLiked'] = true;
        } else {
          topic['hasLiked'] = false;
        }
      }

      topics.push(topic);
    }

    context.commit('setTopicsList', topics);
  },
  async editTopic(context, newTopicData) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics/${newTopicData.id}.json?auth=${context.rootGetters.token}`,
      {
        method: 'PUT',
        body: JSON.stringify(newTopicData),
      }
    );

    authStore.dispatch('handleError', response);
  },
  async addTopic(context, data) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics.json?auth=${context.rootGetters.token}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    authStore.dispatch('handleError', response);
  },
  async fetchTopicDetails(context, topicId) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics/${topicId}.json?auth=${context.rootGetters.token}`
    );

    const responseData = await response.json();

    authStore.dispatch('handleError', response);

    const topicDetails = [
      {
        id: topicId,
        title: responseData.title,
        content: responseData.content,
        likes: responseData.likes ? Object.keys(responseData.likes).length : 0,
        createdBy: responseData.createdBy,
        dateCreated: responseData.dateCreated,
      },
    ];

    if (responseData.likes) {
      if (Object.keys(responseData.likes).includes(authStore.getters['user'])) {
        topicDetails[0]['hasLiked'] = true;
      } else {
        topicDetails[0]['hasLiked'] = false;
      }
    }

    context.commit('setTopicDetails', topicDetails);
  },
  async fetchComments(context, topicId) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics/${topicId}/comments.json?auth=${context.rootGetters.token}`
    );

    const responseData = await response.json();

    authStore.dispatch('handleError', response);

    const comments = [];

    for (const key in responseData) {
      const comment = {
        id: key,
        topicId: responseData[key].topicId,
        comment: responseData[key].comment,
        createdBy: responseData[key].createdBy,
        dateCreated: responseData[key].dateCreated,
      };

      comments.unshift(comment);
    }

    context.commit('setCommentsList', comments);
  },
  async addTopicComment(context, data) {
    if (data.comment != '') {
      const response = await fetch(
        `${CONFIGDATA.FIREBASE_URL}/topics/${data.topicId}/comments.json?auth=${context.rootGetters.token}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      authStore.dispatch('handleError', response);
    }
  },
  async deleteTopicComment(context, data) {
    const response = await fetch(
      `${CONFIGDATA.FIREBASE_URL}/topics/${data.topicId}/comments/${data.commentId}.json?auth=${context.rootGetters.token}`,
      {
        method: 'DELETE',
      }
    );

    authStore.dispatch('handleError', response);
  },
  async likeUnlike(context, data) {
    const likesURL = `${CONFIGDATA.FIREBASE_URL}/topics/${data.topicId}/likes/${data.user}.json?auth=${context.rootGetters.token}`;

    const likesCollection = await fetch(likesURL);
    const responseData = await likesCollection.json();

    if (responseData != null) {
      // delete user from like object
      const response = await fetch(likesURL, {
        method: 'DELETE',
      });

      authStore.dispatch('handleError', response);
    } else {
      const response = await fetch(likesURL, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      authStore.dispatch('handleError', response);
    }
  },
};
