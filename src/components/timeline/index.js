import React from 'react';
import PropTypes from 'prop-types';
import './Timeline.css';
import Card from '../card';
import CardHeader from '../card-header';
import CardFooter from '../card-footer';
import CardTitle from '../card-title';
import CardImage from '../card-image';
import CardAuthor from '../card-author';

class Timeline extends React.Component {
  render() {
    return (
      <div className="timeline">
        {this.props.items.map((item, i) => (
          <Card key={'card-' + i}>
            <CardHeader>
              {item.properties.author.map((author) => {
                if ('string' === typeof author) {
                  return (
                    <CardAuthor
                      name={author}
                      url={author}
                      key={`card-${i}-author-${author}`}
                    />
                  );
                } else {
                  return (
                    <CardAuthor
                      name={(author.properties.name ? author.properties.name[0] : 'unknown')}
                      url={author.properties.url[0]}
                      photo={author.properties.photo ? author.properties.photo[0] : null}
                      key={`card-${i}-author-${author.properties.url[0]}`}
                    />
                  );
                }
              })}
              {item.properties.name &&
                <CardTitle title={item.properties.name[0]} /> 
              }
            </CardHeader>
            {item.properties.photo && (
              item.properties.photo.map((photo, photoIndex) => (
                <CardImage src={photo} key={`card-${i}-photo-${photoIndex}`} />
              ))
            )}
            {item.properties.summary &&
              <p className="card__text">{item.properties.summary}</p> 
            }
            {/*<div dangerouslySetInnerHTML={{__html: item.properties.content[0].html}}></div>*/}
            {/*{item.properties.category.map((category) => (<span>{category}</span>))}*/}
            <CardFooter>
              {item.properties.published ? (<datetime>{item.properties.published}</datetime>) : null}
              <button onClick={() => console.log(item)}>Log</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
}
  
Timeline.defaultProps = {
  items: [],    
};

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Timeline;
  