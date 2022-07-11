import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import Rating from './Rating'
import axios from 'axios'
import { useContext } from 'react'
import { Store } from '../Store'

function Product (props) {

    const {product} = props

    const { state, dispatch: ctxDispatch} = useContext(Store)

    const {
        cart: {cartItems}
    } = state

    //criar a função de atualizar a quantidade do carrinho
    const addToCartHandler = async (item) =>{

        const existItem = cartItems.find( (x) => x._id === product._id )

        const quantity = existItem ? existItem.quantity + 1 : 1

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

    return(
        <Card>

            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} className="card-img-top" />
            </Link>

            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews}/>
                <Card.Text>R${product.price}</Card.Text>
                {product.countInStock === 0 ? <Button variant='light' disable>Fora de Estoque</Button> :
                <Button onClick={addToCartHandler(product)}>Adicionar ao Carrinho</Button>
                }
                
            </Card.Body>
        
        </Card>
    )
}

export default Product