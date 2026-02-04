import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import ConsultaClientes from './pages/ConsultaClientes';
import MantenimientoCliente from './pages/MantenimientoCliente';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/home">
        <Home />
      </ProtectedRoute>
      <ProtectedRoute path="/clientes" exact>
        <ConsultaClientes />
      </ProtectedRoute>
      <ProtectedRoute path="/clientes/mantenimiento/:id">
        <MantenimientoCliente />
      </ProtectedRoute>
      <ProtectedRoute path="/clientes/mantenimiento">
        <MantenimientoCliente />
      </ProtectedRoute>
      <Route exact path="/">
        <Redirect to={isAuthenticated ? '/home' : '/login'} />
      </Route>
      <Route path="*" component={ErrorPage} />
    </Switch>
  );
}

export default App;
