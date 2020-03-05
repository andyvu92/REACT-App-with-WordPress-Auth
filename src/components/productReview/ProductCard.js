import React from 'react'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Rating from '@material-ui/lab/Rating'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function ProductCard(props) {

    const handleButtonClick = (index) => {
        props.setReviewLoading(index, true)
        props.submitReview(index)
    }

    return (
        props.products.map((item, index) => {
            return (
                <Card className="product-card" key={item.id}>
                    <CardActionArea>
                        <CardMedia
                            className="card-image"
                            image={item.image_url}
                            title={item.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {item.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className="review-form">
                        {props.reviews[index]['success'] ? (
                            <div className="success-message">
                                <Typography gutterBottom variant="h6" component="h5">
                                    Thank You!
                                </Typography>
                                <Typography gutterBottom component="p">
                                    Your review is value to us.
                                </Typography>
                            </div>
                        ) : (
                            <React.Fragment>
                                <TextField 
                                    onChange={props.updateReviewName(index)} 
                                    className="user-name" 
                                    label="Name"
                                    value={props.reviews[index]['reviewer']}
                                />
                                <TextField 
                                    onChange={props.updateReviewEmail(index)} 
                                    className="user-email" 
                                    label="Email"
                                    value={props.reviews[index]['reviewer_email']}
                                />
                                <TextField multiline rows={3} onChange={props.updateReviewComment(index)} className="user-comment" label="Comment" />
                                <Box className="user-rating" component="fieldset" mb={3} borderColor="transparent">
                                    <Typography component="legend">Star Rating</Typography>
                                    <Rating
                                        name={`simple-controlled-${index}`}
                                        size="large"
                                        value={props.reviews[index]['rating']}
                                        onChange={(event, rate) => {
                                            props.updateReviewRate(event, rate)
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            props.setCurrentRateIndex(index)
                                        }}
                                    />
                                </Box>
                                <div className="submit-review-wrapper">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="submit-button"
                                        disabled={props.reviews[index]['loading']}
                                        onClick={() => handleButtonClick(index)}
                                    >
                                        {props.reviews[index]['loading'] ? 'Sending...' : 'Submit Review'}
                                    </Button>
                                    {props.reviews[index]['loading'] && <CircularProgress size={24} className="progress-spinner" />}
                                </div>
                                {(props.reviews[index]['success'] === false && props.reviews[index]['rating'] !== null) &&
                                    <Typography gutterBottom component="p" className="error-message">
                                        Oops! Please try again or <a rel="noopener noreferrer" target="_blank" href={item.url}>click here</a> to write a review on this product page.
                                    </Typography>
                                }
                                {(props.reviews[index]['success'] === false && props.reviews[index]['rating'] === null) &&
                                    <Typography gutterBottom component="p" className="error-message">
                                        Please select star rating.
                                    </Typography>
                                }

                            </React.Fragment>
                        )}
                    </CardActions>
                </Card>
            )
        })
    )
}
