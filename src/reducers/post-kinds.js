import { fromJS } from 'immutable';
import PhotoIcon from 'material-ui-icons/PhotoCamera';
import AudioIcon from 'material-ui-icons/Headset';
import CheckinIcon from 'material-ui-icons/LocationOn';
import ArticleIcon from 'material-ui-icons/LibraryBooks';
import NoteIcon from 'material-ui-icons/Chat';
import AllIcon from 'material-ui-icons/Home';

const postKinds = [
  {
    id: 'all',
    name: 'All',
    icon: AllIcon,
    selected: true,
    filter: (post) => true,
  },
  {
    id: 'note',
    name: 'Notes',
    icon: NoteIcon,
    selected: false,
    filter: (post) => (post.content && !post.name && !Array.isArray(post.photo)),
  },
  {
    id: 'photo',
    name: 'Photos',
    icon: PhotoIcon,
    selected: false,
    filter: (post) => (post.photo),
  },
  {
    id: 'post',
    name: 'Articles',
    icon: ArticleIcon,
    selected: false,
    filter: (post) => (post.name && post.content),
  },
  {
    id: 'audio',
    name: 'Podcasts & Music',
    icon: AudioIcon,
    selected: false,
    filter: (post) => (post.audio),
  },
  {
    id: 'checkins',
    name: 'Checkins',
    icon: CheckinIcon,
    selected: false,
    filter: (post) => (post.location),
  },
];

const defaultState = fromJS(postKinds);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'SELECT_POST_KIND': {
      return state.map((postKind) => {
        postKind = postKind.set('selected', false);
        if (postKind.get('id') === payload.postKindId) {
          postKind = postKind.set('selected', true);
        }
        return postKind;
      });
    }
    default: {
      return state;
    }
  }
};