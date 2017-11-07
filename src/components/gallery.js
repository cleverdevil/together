import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import FullscreenPhoto from './fullscreen-photo';

const styles = theme => ({});

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPost: null,
      selectedPhoto: null,
    };
  }

  render() {
    const contentWidth = (document.getElementById('root').clientWidth - 49);
    const columnCount = Math.floor(contentWidth / 300)
    const cellHeight = Math.floor(contentWidth / columnCount);
    return (
      <div>
        <GridList cellHeight={cellHeight} cols={columnCount} spacing={0}>
          {this.props.posts.filter(post => post.photo).map(post => {
            // Parse author data
            let author = {
              name: 'Unknown',
              photo: null,
              url: null,
            };
            if (post.author) {
              if (typeof post.author === 'string') {
                author.name = post.author;
                author.url = post.author;
              } else if (typeof post.author === 'object') {
                author.name = post.author.name;
                author.photo = post.author.photo;
                author.url = post.author.url;
              }
            }
            if (typeof post.photo === 'string') {
              post.photo = [post.photo];
            }
            return post.photo.map((photo) => (
              <GridListTile key={photo} cols={1} onClick={() => this.setState({selectedPhoto: photo, selectedPost: post})}>
                <img src={photo} alt="" />
                <GridListTileBar
                  title={post.name || (post.content && post.content.text) || ''}
                  subtitle={author.name}
                  actionIcon={
                    <Avatar
                      aria-label={author.name}
                      alt={author.name}
                      src={author.photo}
                      style={{marginRight: 14}}
                    />
                  }
                />
              </GridListTile>
            ));
          })}
        </GridList>
        <FullscreenPhoto photo={this.state.selectedPhoto} post={this.state.selectedPost} />
      </div>
    );
  }
}
  
Gallery.defaultProps = {
  posts: [],
};

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Gallery));