import PhotoIcon from '@material-ui/icons/PhotoCamera';
import CheckinIcon from '@material-ui/icons/LocationOn';
import AllIcon from '@material-ui/icons/Chat';
import ClassicIcon from '@material-ui/icons/ChromeReaderMode';

const layouts = [
  {
    id: 'timeline',
    name: 'Timeline',
    icon: AllIcon,
    filter: post => true,
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: ClassicIcon,
    filter: post => true,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: PhotoIcon,
    filter: post => post.photo,
  },
  {
    id: 'map',
    name: 'Map',
    icon: CheckinIcon,
    filter: post =>
      (post.location && post.location.latitude && post.location.longitude) ||
      (post.checkin && post.checkin.latitude && post.checkin.longitude),
  },
];

export default layouts;
