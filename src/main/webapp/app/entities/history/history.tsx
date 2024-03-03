import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './history.reducer';

export const History = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const historyList = useAppSelector(state => state.history.entities);
  const loading = useAppSelector(state => state.history.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="history-heading" data-cy="HistoryHeading">
        Últimos [{history?.length}] eventos registratos no sistema
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        {historyList && historyList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  Id <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th>Livro</th>
                <th>Categoria</th>
                <th>Paginas</th>
                <th className="hand" onClick={sort('points')}>
                  Points <FontAwesomeIcon icon={getSortIconByFieldName('points')} />
                </th>
                <th className="hand" onClick={sort('createdDate')}>
                  Registered At <FontAwesomeIcon icon={getSortIconByFieldName('createdDate')} />
                </th>
                <th className="hand" onClick={sort('registeredBy')}>
                  Registered By <FontAwesomeIcon icon={getSortIconByFieldName('registeredBy')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((history, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{history.id}</td>
                  <td>{history.book?.title}</td>
                  <td>{history.book?.category?.title}</td>
                  <td>{history.book?.pages}</td>
                  <td>{history.points}</td>
                  <td>{history.createdDate}</td>
                  <td>{history.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Não existem eventos registrados no sistema</div>
        )}
      </div>
    </div>
  );
};

export default History;
