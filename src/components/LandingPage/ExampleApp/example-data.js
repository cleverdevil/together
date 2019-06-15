import faker from 'faker'

const examplePost = (data = {}) => {
  const basePost = {
    _id: faker.random.uuid(),
    // name: faker.hacker.phrase(),
    content: { text: faker.hacker.phrase() },
    published: faker.date.past(),
    url: 'https://alltogethernow.io',
    author: {
      name: faker.name.findName(),
      photo: faker.image.avatar(),
    },
  }

  return Object.assign({}, basePost, data)
}

const sortDate = (a, b) => b.published - a.published

const timelinePosts = [
  examplePost(),
  examplePost(),
  examplePost(),
  examplePost(),
  examplePost(),
].sort(sortDate)

const mapPost = () =>
  examplePost({
    checkin: {
      name: faker.company.companyName(),
      latitude: faker.random.number({
        precision: 0.00001,
        min: 40.396,
        max: 40.444,
      }),
      longitude:
        0 -
        faker.random.number({
          precision: 0.00001,
          min: 3.67,
          max: 3.728,
        }),
    },
  })

const mapPosts = [mapPost(), mapPost(), mapPost(), mapPost(), mapPost()].sort(
  sortDate
)

const photoPost = () =>
  examplePost({
    photo: [
      'https://picsum.photos/1400/800/?image=' + faker.random.number(1084),
    ],
  })

const galleryPosts = [
  photoPost(),
  photoPost(),
  photoPost(),
  photoPost(),
  photoPost(),
].sort(sortDate)

const classicPost = () =>
  examplePost({
    name: faker.lorem.words(),
    content: { html: '<p>' + faker.lorem.paragraphs(3, '</p><p>') + '</p>' },
  })

const classicPosts = [
  classicPost(),
  classicPost(),
  classicPost(),
  classicPost(),
  classicPost(),
].sort(sortDate)

export default {
  timeline: {
    id: 'timeline',
    title: '📱 Timeline View',
    items: timelinePosts,
  },
  classic: {
    id: 'classic',
    title: '📰 Classic View',
    items: classicPosts,
  },
  gallery: {
    id: 'gallery',
    title: '📸 Gallery View',
    items: galleryPosts,
  },
  map: {
    id: 'map',
    title: '🗺️ Map View',
    items: mapPosts,
  },
}
