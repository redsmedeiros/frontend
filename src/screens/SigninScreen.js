import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios'
import { useContext, useState } from "react";
import { Store } from '../Store.js'

export default function SigninScreen(){

    //instanciar o navigate
    const navigate = useNavigate()

    const { search } = useLocation()

    //obter o redirect
    const redirctInUrl = new URLSearchParams(search).get('redirect')

    const redirect = redirctInUrl ? redirctInUrl : "/"

    //criar o hook de state para as variaveis do form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //acessar o contexto do carrinho
    const { state, dispatch: ctxDispatch } = useContext(Store)

    //criar a função de submit do formulario
    const submitHandler = async (e) => {

        //previnir o refresh de evento
        //e.preventDefault()
        console.log(email, password)

        //fazer a requisição ajax para realizar o login
        try{

            
            //receber a requisição passando os dados do form
            const { data } = await Axios.post('/api/users/signin', {email, password} )

            console.log(data)

            ctxDispatch({ type: 'USER_SIGNIN', payload: data})

            //armazenar os dados no localstorage
            localStorage.setItem('userInfo', JSON.stringify(data))

            //redirecionar
            navigate( redirect || '/')

        }catch(err){

            alert('teste')
        }


    }

    return(

        <Container className="small-container">

            <Helmet>
                <title>Sign in</title>
            </Helmet>

            <h1 className="my-3">Entrar</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) =>{ setEmail(e.target.value)}} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password" required onChange={ (e) => { setPassword(e.target.value) } } />
                </Form.Group>

                <div className="mb-3">
                    <Button type="submit">Entrar</Button>
                </div>

                <div className="mb-3">
                    Novo Usuário
                    <Link to={`/signup?redirect=${redirect}`}> Criar nova conta</Link>
                </div>
            </Form>

        </Container>
    )
}