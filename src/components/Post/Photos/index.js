import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GallerySlider from '../../GallerySlider'
import resizeImage from '../../../modules/get-image-proxy-url'
import style from './style'

const TogetherCardPhotos = ({ classes, photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const Photos = ({}) => {
    if (photos.length === 1) {
      return (
        <img
          className={classes.fullImage}
          src={resizeImage(photos[0], { w: 600 })}
          alt=""
          onClick={() => setSelectedPhoto(0)}
        />
      )
    } else if (Array.isArray(photos)) {
      let cols = photos.length
      if (cols === 4) {
        cols = 2
      }
      if (cols > 3) {
        cols = 3
      }
      let cellHeight = 200
      let cardWidth = document.getElementById('root').clientWidth - 49 - 12 - 12
      if (cardWidth < 600) {
        cellHeight = Math.floor(cardWidth / 3)
      }
      return (
        <GridList cellHeight={cellHeight} cols={cols} spacing={0}>
          {photos.map((photo, i) => (
            <GridListTile
              key={`card-photo-${i}`}
              cols={1}
              onClick={() => setSelectedPhoto(i)}
            >
              <img
                src={resizeImage(photo, {
                  w: cellHeight,
                  h: cellHeight,
                  t: 'square',
                })}
                alt=""
              />
            </GridListTile>
          ))}
        </GridList>
      )
    }
    return null
  }

  return (
    <Fragment>
      <Photos />
      {selectedPhoto !== null && (
        <GallerySlider
          medias={photos.map(photo => ({ photo }))}
          startIndex={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          open={true}
        />
      )}
    </Fragment>
  )
}

export default withStyles(style)(TogetherCardPhotos)
