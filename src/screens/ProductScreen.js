import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useReducer, useContext } from 'react'
import axios from 'axios'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { Helmet } from 'react-helmet-async'

import Rating from '../components/Rating'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { Store } from '../Store'

//USAR O REDUCER PARA TER UM CONTROLE MELHOR DOS STATUS DA REQUISIÇÃO
const reducer = (state, action) =>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, product: action.payload}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

function ProductScreen (){

    const navigate = useNavigate()

    const params = useParams()
    const { slug } = params

        //USAR O USEREDUCER NO LUGAR DO USESTATE COMUM PARA CAPTAR AS MUDANÇAS DO COMPONENTE
        const [{loading, error, product}, dispatch] = useReducer(reducer, {loading: true, error: '', product: []})

        useEffect(()=>{
    
                const fetchData = async ()=> {
                    dispatch({ type: 'FETCH_REQUEST'})
    
                    try{
    
                        const result = await axios.get(`/api/products/slug/${slug}`)
    
                        dispatch({ type: 'FETCH_SUCCESS', payload: result.data})
    
                    }catch(err){
    
                        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
                    }
                }
            fetchData()
    
        }, [slug])

    const {state, dispatch: ctxDispatch} = useContext(Store)

    const { cart } = state    

    const addToCartHandler = async ()=>{

        const existItem = cart.cartItems.find( (x) => x._id === product._id )

        const quantity = existItem ? existItem.quantity + 1 : 1

        const { data } = await axios.get(`/api/products/${product._id}`)

        if(data.countInStock < quantity){
            window.alert('Produto em falta no estoque')
            return
        }

        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity }})

        navigate('/cart')
    }    

    return(
        
        loading ? (<LoadingBox> Loading... </LoadingBox>) : error ? (<MessageBox variant="danger">{error}</MessageBox>) : 

        <div>
            <h1>Adicionar Produto</h1>
            <div className='container mt-4'>
            <Row>
                <Col md={6}><img className='img-large' src={product.image} alt={product.name}></img></Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Preço: R${product.price}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Descrição: <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Produto:</Col>
                                        <Col>R${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? (<Badge bg="success">Em Estoque</Badge>) : (<Badge bg="danger">Não Disponível</Badge>) } 
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <div className='d-grid'>
                                            <Button variant='primary' onClick={addToCartHandler()}>Adicionar ao Carrinho</Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>

                    </Card>
                </Col>
            </Row>
            </div>
            
        </div>

    )

}

export default ProductScreen