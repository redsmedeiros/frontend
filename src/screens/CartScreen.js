import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {Store} from '../Store'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import MessageBox from "../components/MessageBox";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup'
import Button from "react-bootstrap/esm/Button";
import Card from 'react-bootstrap/Card'
import axios from "axios";


export default function CartScreen(){

    const navigate = useNavigate()

    //ter acesso ao context
    const { state, dispatch: ctxDispatch } = useContext(Store)

    //escutar as mudanças na variavel de carItens
    const { cart: { cartItems } } = state

    //criar a função de atualizar a quantidade do carrinho
    const updateCartHandler = async (item, quantity) =>{



        //fazer uma requisição axios para pegar o item
        const { data } = await axios.get(`/api/products/${item._id}`)

        //fazer a verificaçãode estoque
        if(data.countInStock < quantity){
            window.alert('Produto em falta no estoque')
            return
        }
        //vai atualizar a vairiavel de item com o valor chegado
        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity }})


    }

    const removeItemHandler = (item) =>{

        ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item })
    }

    const useCheckoutHandler = () =>{

        navigate("/signin?redirect=/shipping")
        
    }

    //renderizar o html
    return(
        <div>
            <Helmet><title>Carrinho de Compras</title></Helmet>

            <h1>Carrinho de Compras</h1>

            <div className="mt-4">
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (<MessageBox> Carrinho está  vazio <Link to="/">Ir para Loja</Link></MessageBox>) : 
                    
                    (
                        <ListGroup>
                            {cartItems.map( (item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" ></img>{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>

                                        <Col md={3}>
                                            <Button variant="light"
                                             onClick={()=>{ //passar o item que vou atualizar e diminiuir a quantidade em 1
                                                updateCartHandler(item, item.quantity - 1 )}
                                            }

                                            disable={item.quantity === 1}><i className="fas fa fa-minus-circle"></i></Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            <Button variant="light" 
                                            onClick={()=>{ //passar o item que vou atualizar e aumentar a quantidade em 1
                                                updateCartHandler(item, item.quantity + 1 )}
                                            }
                                            disable={item.quantity === item.countInStock}><i className="fas fa fa-plus-circle"></i></Button>
                                        </Col>

                                        <Col md={3}>R${item.price}</Col>
                                           
                                        <Col md={2}>  <Button
                                        onClick={()=> removeItemHandler(item)}
                                        variant="light"><i className="fas fa-trash"></i></Button> </Col>
                                    </Row>
                                </ListGroup.Item>
                            ) )}
                        </ListGroup>
                    )
                    }
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                <h3>
                                    Subtotal ({cartItems.reduce( (a, c) => a + c.quantity, 0)}{' '} items) : R$ {cartItems.reduce( (a, c) => a + c.price * c.quantity, 0)}
                                </h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                        onClick={useCheckoutHandler()}
                                        type="button" variant="primary" disable={cartItems.length === 0}>
                                            Ir para Pagamento
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </div>                
        </div>
    )

    
}

