import './home.scss';

import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Alert, Badge, Button, Card, Col, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getBooks } from 'app/entities/book/book.reducer';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import { getEntitiesByUser as getUserEvents, getUsersRanking, setBookAsRead } from 'app/entities/history/history.reducer';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getSortState } from 'react-jhipster';
import { IBook } from 'app/shared/model/book.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICategory } from 'app/shared/model/category.model';
import { IHistory } from 'app/shared/model/history.model';
import { IRanking } from 'app/shared/model/ranking.model';
import { IUser } from 'app/shared/model/user.model';

type UserDashboardProps = {
  ranking: IRanking;
  account: IUser;
};

type UserRankingProps = {
  ranking: IRanking[];
};

type BooksListProps = {
  books?: IBook[];
  categories?: ICategory[];
  userHistory?: IHistory[];
  onReadBook?: (book: IBook, read: boolean) => void;
};

const UserDashboard: React.FC<UserDashboardProps> = ({ ranking, account }) => {
  const pointsTotal = ranking?.points || 0;

  return (
    <div>
      <h2 id="dashboard" data-cy="DashboardHeading">
        Meu Dashboard
        {/*{account.firstName}*/}
      </h2>
      {!!ranking?.categories && (
        <ListGroup>
          <ListGroupItem active={true}>
            Total de livros lidos: {ranking?.books}. Pontos: {pointsTotal}
          </ListGroupItem>
          {ranking.categories.map((el: any) => (
            <ListGroupItem key={el.userId}>
              <label style={{ paddingRight: 4 }}>
                {el.category.title}. Total de livros: {el.books}
                <Badge pill color={el.points > 0 ? 'warning' : 'secondary'} style={{ marginLeft: 6 }}>
                  Pontos: {el.points || 0}
                </Badge>
                {!!el?.trophy && (
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

const UsersRanking: React.FC<UserRankingProps> = ({ ranking }) => {
  return (
    <div>
      <h2 id="dashboard" data-cy="DashboardHeading">
        Users Ranking
      </h2>
      {!!ranking?.length && (
        <ListGroup numbered>
          {ranking.map((el: any) => (
            <ListGroupItem key={el.userId}>
              <label style={{ paddingRight: 4 }}>
                {el.userId} {el.userName} [{el.email}]
                <Badge pill color={el.points > 0 ? 'info' : 'secondary'} style={{ marginLeft: 6 }}>
                  Points: {el.points || 0}
                </Badge>
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
        </Col>
        {/*<Col className={'col-6'}>*/}
        {/*  <ValidatedField*/}
        {/*    id="book-category"*/}
        {/*    name="book-category"*/}
        {/*    type="select"*/}
        {/*    className="form-control"*/}
        {/*    onChange={event => {*/}
        {/*      console.log(event.target.value);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <option value="0" key="0">*/}
        {/*      Todas as Categorias*/}
        {/*    </option>*/}
        {/*    {categories.map(category => (*/}
        {/*      <option value={category.id} key={category.id}>*/}
        {/*        {category.title}*/}
        {/*      </option>*/}
        {/*    ))}*/}
        {/*  </ValidatedField>*/}
        {/*</Col>*/}
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
  const ranking = useAppSelector(state => state.history.ranking);

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
    dispatch(getUsersRanking());
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  return (
    <Row>
      <Col>
        <h1 className="display-4">Esse eu já li! {account?.id}</h1>
        {account && account?.login && (
          <>
            <p className="lead">Olá {account.login}, selecione os livros que já leu e ganhe pontos.</p>
            <div style={{ marginBottom: 20 }}>
              <Row>
                <Col md={6}>
                  <UserDashboard ranking={ranking?.find((e: IRanking) => e.userId === account.id)} account={account} />
                </Col>
                <Col md={6}>
                  <UsersRanking ranking={ranking?.filter((e: IRanking) => e.points > 0).sort((a, b) => b.points - a.points)} />
                </Col>
              </Row>
            </div>
            <Card>
              <BooksList books={bookList} categories={categoryList} userHistory={userHistory} onReadBook={onReadBook} />
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Home;
