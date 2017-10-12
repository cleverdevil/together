import { fromJS } from 'immutable';
import PhotoIcon from 'material-ui-icons/PhotoCamera';
import AudioIcon from 'material-ui-icons/Headset';
import CheckinIcon from 'material-ui-icons/LocationOn';
import ArticleIcon from 'material-ui-icons/LibraryBooks';
import NoteIcon from 'material-ui-icons/Chat';
import AllIcon from 'material-ui-icons/Home';
import LikeIcon from 'material-ui-icons/ThumbUp';
import RepostIcon from 'material-ui-icons/Repeat';
import EventIcon from 'material-ui-icons/Event';
import VideoIcon from 'material-ui-icons/Movie';

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
    filter: (post) => (post.content && !post.name && !Array.isArray(post.photo) && !post.checkin && !post.video && !post.audio && !post.type !== 'event'),
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
    id: 'video',
    name: 'Videos',
    icon: VideoIcon,
    selected: false,
    filter: (post) => (post.video),
  },
  {
    id: 'checkins',
    name: 'Checkins',
    icon: CheckinIcon,
    selected: false,
    filter: (post) => (post.checkin),
  },
  {
    id: 'event',
    name: 'Events',
    icon: EventIcon,
    selected: false,
    filter: (post) => (post.type === 'event'),
  },
  {
    id: 'like',
    name: 'Likes',
    icon: LikeIcon,
    selected: false,
    filter: (post) => (post['like-of']),
  },
  {
    id: 'repost',
    name: 'Reposts',
    icon: RepostIcon,
    selected: false,
    filter: (post) => (post['repost-of']),
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