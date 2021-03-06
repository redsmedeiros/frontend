

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'


import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import Badge from 'react-bootstrap/esm/Badge';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import NavDropdown from 'react-bootstrap/NavDropdown'


function App() {

  const { state } = useContext(Store)
  const { cart, userInfo } = state

  return (

    <BrowserRouter>

      <div className='d-flex flex-column site-container'>
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>RPPS</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                  <Link to="/cart" className='nav-link'>
                    Carrinho
                    {cart.cartItems.length > 0 && (<Badge pill bg="danger">{cart.cartItems.reduce( (a, c) => a + c.quantity, 0)}</Badge>)}
                  </Link>
                  {userInfo ? (<NavDropdown title={userInfo.name} id="basic-nav-dropdown"></NavDropdown>) : (<Link className="nav-link" to="/signin"> Login </Link>)}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className='mt-5'>
            <Routes>
              <Route path='/product/:slug' element={<ProductScreen/>} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen/>}/>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>

        <footer>
          <div className='text-center'>Teste</div>
        </footer>
      </div>
    
    </BrowserRouter>
    
  );
}

export default App;
