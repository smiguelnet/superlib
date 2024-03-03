import React from 'react';
import { ValidatedField } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Row, Col, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { type FieldError, useForm } from 'react-hook-form';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password, rememberMe }) => {
    props.handleLogin(username, password, rememberMe);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const { loginError, handleClose } = props;

  const handleLoginSubmit = e => {
    handleSubmit(login)(e);
  };

  return (
    <Row className="justify-content-center">
      <Col md="8">
        <Form onSubmit={handleLoginSubmit}>
          <ModalHeader id="login-title" data-cy="loginTitle" toggle={handleClose}>
            Olá, faça seu login no sistema
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12">
                {loginError ? (
                  <Alert color="danger" data-cy="loginError">
                    <strong>Failed to sign in!</strong> Please check your credentials and try again.
                  </Alert>
                ) : null}
              </Col>
              <Col md="12">
                <ValidatedField
                  name="username"
                  label="Username"
                  placeholder="Your username"
                  required
                  autoFocus
                  data-cy="username"
                  validate={{ required: 'Username cannot be empty!' }}
                  register={register}
                  error={errors.username as FieldError}
                  isTouched={touchedFields.username}
                />
                <ValidatedField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Your password"
                  required
                  data-cy="password"
                  validate={{ required: 'Password cannot be empty!' }}
                  register={register}
                  error={errors.password as FieldError}
                  isTouched={touchedFields.password}
                />
                <ValidatedField name="rememberMe" type="checkbox" check label="Remember me" value={true} register={register} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button color="primary" type="submit" data-cy="submit" className={'mt-2'}>
                  Sign in
                </Button>
              </Col>
            </Row>
            <hr />
            <div>
              <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
                Esqueceu sua senha?
              </Link>
            </div>
            <div className={'pt-2'}>
              <span>You don&apos;t have an account yet?</span> <Link to="/account/register">Criar uma nova conta de usuário</Link>
            </div>
          </ModalBody>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginModal;
