const NeDB = require('nedb');
const { Service } = require('feathers-nedb');

const UserModel = new NeDB({
  filename: './data/users.db',
  autoload: true,
});

class UserService extends Service {
  constructor() {
    super({ Model: UserModel });
  }

  create(data, params) {
    return new Promise((resolve, reject) => {
      this.find({
        query: {
          $limit: 1,
          me: data.me,
        },
      })
        .then(res => {
          if (res && res[0] && res[0].me == data.me) {
            const user = res[0];
            return super.update(user._id, data, params);
          } else {
            return super.create(data, params);
          }
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = new UserService();
