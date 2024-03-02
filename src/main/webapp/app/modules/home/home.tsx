import './home.scss';

import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Alert, Badge, Button, Card, Col, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';

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

type DashboardProps = {
  books?: IBook[];
  categories?: ICategory[];
  userHistory?: IHistory[];
};

type BooksListProps = DashboardProps & {
  onReadBook?: (book: IBook, read: boolean) => void;
};

const Dashboard: React.FC<DashboardProps> = ({ books, categories, userHistory }) => {
  // TODO: get this var from server configuration
  const TOTAL_BOOKS_TO_ATTRIBUTE_TROPHY = 5;

  const pointsTotal = userHistory?.map(e => e?.points || 0).reduce((a, b) => a + b, 0);

  const pointsPerCategory = categories.map(category => {
    const categoryUserHistory = userHistory?.filter(history => history.book.category.id === category.id);
    if (!!categoryUserHistory?.length) {
      const totalPoints = categoryUserHistory.map(e => e.points).reduce((a, b) => a + b, 0);
      const totalBooksRead = new Set(categoryUserHistory.map(e => e.book?.id))?.size || 0;

      return { ...category, points: totalPoints, totalBooks: totalBooksRead };
    }
    return category;
  });

  return (
    <div>
      <h2 id="dashboard" data-cy="DashboardHeading">
        Dashboard{' '}
        <Badge pill color={pointsTotal > 0 ? 'warning' : 'secondary'}>
          Total Points: {pointsTotal}
        </Badge>
      </h2>
      {!!pointsPerCategory?.length && (
        <ListGroup numbered>
          {pointsPerCategory.map(e => (
            <ListGroupItem>
              <label style={{ paddingRight: 4 }}>
                {e.title}
                {e.points > 0 && (
                  <Badge pill color={'warning'} style={{ marginLeft: 6 }}>
                    Points: {e.points}
                  </Badge>
                )}
                {!!e?.totalBooks && (
                  <>
                    <label style={{ marginLeft: 10, marginRight: 10 }}>|</label>
                    <label> Livros: {e.totalBooks}</label>
                  </>
                )}
                {e.totalBooks >= TOTAL_BOOKS_TO_ATTRIBUTE_TROPHY && (
                  <Badge pill color={'success'} style={{ marginLeft: 6 }}>
                    <FontAwesomeIcon icon={'trophy'} />
                  </Badge>
                )}
              </label>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

const BooksList: React.FC<BooksListProps> = ({ books, categories, userHistory, onReadBook }) => {
  const getBookHistory = (bookId: number): IHistory => userHistory?.find(e => e?.book?.id === bookId);
  return !!books?.length ? (
    <>
      <Row>
        <Col className={'col-6'}>
          <h2 id="book-heading" data-cy="BookHeading">
            Existem {books.length} Livros Disponíveis
          </h2>
          <p>
            Você já leu {userHistory.length} livro{userHistory.length > 0 ? 's' : ''}.
          </p>
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
                const bookHistory = getBookHistory(book.id);
                const isBookRead = !!bookHistory?.id;
                return (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {book.title}
                      {!!bookHistory?.points && (
                        <div className={'text-success'}>
                          + {bookHistory.points} point{bookHistory.points > 0 ? 's' : ''}
                        </div>
                      )}
                    </td>
                    <td>{book.category?.title}</td>
                    <td>{book.pages}</td>
                    <td>{book.author}</td>
                    <td>{book.year}</td>
                    <td>
                      <Button
                        color={isBookRead ? 'danger' : 'success'}
                        size="sm"
                        style={{ width: 170 }}
                        onClick={() => onReadBook(book, !isBookRead)}
                      >
                        <FontAwesomeIcon icon={isBookRead ? 'trash' : 'book'} className={'pt-2'} style={{ width: 20 }} />{' '}
                        <span className="d-none d-md-inline">{`${isBookRead ? 'Ops, Desmarcar' : 'Marcar como Lido'}`}</span>
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
  const userHistory = useAppSelector(state => state.history.entities);

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

        {account?.login ? (
          <>
            <p className="lead">Olá {account.login}, selecione os livros que já leu e ganhe pontos.</p>
            <Card className={'mb-3'}>
              <Dashboard books={bookList} categories={categoryList} userHistory={userHistory} />
            </Card>
            <Card>
              <BooksList books={bookList} categories={categoryList} userHistory={userHistory} onReadBook={onReadBook} />
            </Card>
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
