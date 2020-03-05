import React, {useState, useEffect} from 'react'
import axios from 'axios'
import queryString from 'query-string'

import './ProductReview.sass'

//import child components
import ProductCard from './productReview/ProductCard'

const loadingIcon = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve" viewBox="0 0 26.349 26.35">
    <g>
        <g>
            <circle cx="13.792" cy="3.082" r="3.082"/>
            <circle cx="13.792" cy="24.501" r="1.849"/>
            <circle cx="6.219" cy="6.218" r="2.774"/>
            <circle cx="21.365" cy="21.363" r="1.541"/>
            <circle cx="3.082" cy="13.792" r="2.465"/>
            <circle cx="24.501" cy="13.791" r="1.232"/>
            <path d="M4.694,19.84c-0.843,0.843-0.843,2.207,0,3.05c0.842,0.843,2.208,0.843,3.05,0c0.843-0.843,0.843-2.207,0-3.05    C6.902,18.996,5.537,18.988,4.694,19.84z"/>
            <circle cx="21.364" cy="6.218" r="0.924"/>
        </g>
    </g>
</svg>
`

export default function ProductReview() {
    // api urls
    const postReviewApi = `https://${window.location.hostname}/wp-json/wc/v3/products/reviews`
    const getOrderApi = `https://${window.location.hostname}/wp-json/get-order-products/`

    // initial state
    const [orderDetails, setOrderDetails] = useState(null)
    const [products, setProducts] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [reviews, setReviews] = useState([])
    const [totalReviews, setTotalReviews] = useState(null)
    
    // get order details
    useEffect(() => {
        const location = window.location
        const orderQuery = queryString.parse(location.search)
        setOrderDetails({
            id: orderQuery.order
        })

        // if order id is empty, redirect to homepage
        if(orderQuery.order === undefined){
            window.location.replace(`https://${window.location.hostname}`)
        }
    }, [])

    const createMarkup = (content) => {
        return {__html: content}
    }
    
    // get products from order id
    useEffect(() => {
        orderDetails && axios.get(`${getOrderApi}${orderDetails.id}`)
            .then(res => {
                setProducts(res.data)
                // create product review array
                res.data.map(item => {
                    let temp = {
                        product_id: item.id,
                        reviewer: item.customer_name,
                        reviewer_email: item.customer_email,
                        review: '',
                        rating: null,
                        status: "hold",
                        loading: false,
                        success: item.rated
                    }
                    setReviews(reviews => [...reviews, temp])
                    return true
                })
                // update status to indicate products loaded
                setTotalReviews(res.data.length)
            })
            .catch(error => {
                window.location.replace(`http://${window.location.hostname}`)
            })
    }, [orderDetails])

    // wait until all products are loaded
    useEffect(() => {
        totalReviews === reviews.length && setIsLoaded(true)
    }, [totalReviews, reviews])

    // update review name by index
    const updateReviewName = index => e => {
        let tempArray = [...reviews]
        tempArray[index]['reviewer'] = e.target.value
        setReviews(tempArray)
    }

    // update review email by index
    const updateReviewEmail = index => e => {
        let tempArray = [...reviews]
        tempArray[index]['reviewer_email'] = e.target.value
        setReviews(tempArray)
    }

    // assign current index for rating before click
    const [currentRateIndex, setCurrentRateIndex] = useState(null)

    // update review rate by index
    const updateReviewRate = (event, rate) => {
        let tempArray = [...reviews]
        tempArray[currentRateIndex]['rating'] = rate
        tempArray[currentRateIndex]['success'] = null
        setReviews(tempArray)
    }

    // update review email by index
    const updateReviewComment = index => e => {
        let tempArray = [...reviews]
        tempArray[index]['review'] = e.target.value
        setReviews(tempArray)
    }

    // change loading state on submit
    const setReviewLoading = (index, status) => {
        let tempArray = [...reviews]
        tempArray[index]['loading'] = status
        setReviews(tempArray)
    }

    // change form submit status on submit
    const setReviewSuccess = (index, status) => {
        let tempArray = [...reviews]
        tempArray[index]['success'] = status
        setReviews(tempArray)
    }
  
    // submit a  review by index
    const submitReview = (index) => {
        const rating = reviews[index]['rating']
        const data = reviews[index]
        if( rating !== null ){
            // axios.post(`${postReviewApi}?consumer_key=${wooCredentials.ck}&consumer_secret=${wooCredentials.cs}`, data)
            axios.post(postReviewApi, data, 
                {headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.andy_app_nonce_validation.api_nonce,
                }
            })
                .then(res => {
                    if( res.status === 201 ){
                        let tempArray = [...reviews]
                        tempArray[index]['success'] = true
                        tempArray[index]['loading'] = false
                        setReviews(tempArray)
                    } else {
                        let tempArray = [...reviews]
                        tempArray[index]['success'] = false
                        tempArray[index]['loading'] = false
                        setReviews(tempArray)
                    }
                }).catch(error => {
                    let tempArray = [...reviews]
                    tempArray[index]['success'] = false
                    tempArray[index]['loading'] = false
                    setReviews(tempArray)
                    console.clear()
                })
        } else {
            let tempArray = [...reviews]
            tempArray[index]['success'] = false
            tempArray[index]['loading'] = false
            setReviews(tempArray)
        }
    }

    return (
        isLoaded ? (
            <div className="product-grid">
                {(products && isLoaded) &&
                    <ProductCard 
                        products={products} 
                        updateReviewName={updateReviewName}
                        updateReviewEmail={updateReviewEmail}
                        updateReviewRate={updateReviewRate}
                        setCurrentRateIndex={setCurrentRateIndex}
                        updateReviewComment={updateReviewComment}
                        reviews={reviews}
                        setReviewLoading={setReviewLoading}
                        setReviewSuccess={setReviewSuccess}
                        submitReview={submitReview}
                    />}
            </div>
        ) : (
            <div className="loading"
                dangerouslySetInnerHTML={createMarkup(loadingIcon)} 
            />
        )
    )
}
