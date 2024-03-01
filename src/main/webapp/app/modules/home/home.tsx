import './home.scss';

import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Alert, Button, Col, Row, Table } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getBooks } from 'app/entities/book/book.reducer';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import { getEntitiesByUser as getUserEvents, setBookAsRead } from 'app/entities/history/history.reducer';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getSortState, ValidatedField } from 'react-jhipster';
import { IBook } from 'app/shared/model/book.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICategory } from 'app/shared/model/category.model';
import { IHistory } from 'app/shared/model/history.model';

interface BooksListProps {
  books?: IBook[];
  categories?: ICategory[];
  usersHistory?: IHistory[];
  onReadBook?: (book: IBook, read: boolean) => void;
}

const BooksList: React.FC<BooksListProps> = ({ books, categories, usersHistory, onReadBook }) => {
  const verifyBook = (bookId: number): boolean => !!usersHistory?.find(e => e?.book?.id === bookId);

  return !!books?.length ? (
    <>
      <Row>
        <Col className={'col-6'}>
          <h2 id="book-heading" data-cy="BookHeading">
            Livros Disponíveis
          </h2>
          <p>Você já leu {usersHistory.length}</p>
        </Col>
        <Col className={'col-6'}>
          <ValidatedField
            id="book-category"
            name="book-category"
            type="select"
            className="form-control"
            onChange={event => {
              console.log(event.target.value);
            }}
          >
            <option value="0" key="0">
              Todas as Categorias
            </option>
            {categories.map(category => (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            ))}
          </ValidatedField>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                <th>Livro</th>
                <th>Categoria</th>
                <th>Nro Páginas</th>
                <th>Autor</th>
                <th>Ano de Publicação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book: IBook, i: number) => {
                const isBookRead = verifyBook(book.id);
                return (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{book.title}</td>
                    <td>{book.category?.title}</td>
                    <td>{book.pages}</td>
                    <td>{book.author}</td>
                    <td>{book.year}</td>
                    <td>
                      <Button color={isBookRead ? 'danger' : 'success'} size="sm" onClick={() => onReadBook(book, !isBookRead)}>
                        <FontAwesomeIcon icon="book" className={'pl2'} /> <span className="d-none d-md-inline"> Eu já li!</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  ) : (
    <h2>Não existem livros disponíveis</h2>
  );
};

export const Home = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const account = useAppSelector(state => state.authentication.account);
  const loading = useAppSelector(state => state.book.loading);
  const bookList = useAppSelector(state => state.book.entities);
  const categoryList = useAppSelector(state => state.category.entities);
  const usersHistory = useAppSelector(state => state.history.entities);

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const onReadBook = (book: IBook, status: boolean = true) => {
    console.log('add event...', book);
    const entity = { bookId: book.id, read: status, userId: account.id };
    console.log(entity);
    dispatch(setBookAsRead(entity));
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const getAllEntities = () => {
    dispatch(
      getBooks({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
    // TODO: Revise
    dispatch(getCategories({ sort: `${sortState.sort},${sortState.order}` }));
    console.log('user id', { userId: account.id });
    dispatch(getUserEvents());
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <Row>
      <Col>
        <h1 className="display-4">Esse eu já li!</h1>
        <p className="lead">Selecione os livros que já leu e ganhe pontos</p>
        {account?.login ? (
          <>
            <div>
              <Alert color="success">
                Você está logado como: &quot;{account.login}&quot;. [{account.id}]
              </Alert>
            </div>

            <BooksList books={bookList} categories={categoryList} usersHistory={usersHistory} onReadBook={onReadBook} />
          </>
        ) : (
          <div>
            <Alert color="warning">
              If you want to
              <span>&nbsp;</span>
              <Link to="/login" className="alert-link">
                sign in
              </Link>
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;) <br />- User (login=&quot;user&quot; and
              password=&quot;user&quot;).
            </Alert>

            <Alert color="warning">
              You don&apos;t have an account yet?&nbsp;
              <Link to="/account/register" className="alert-link">
                Register a new account
              </Link>
            </Alert>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Home;
