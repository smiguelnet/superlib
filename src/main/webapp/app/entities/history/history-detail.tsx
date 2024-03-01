import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './history.reducer';

export const HistoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const historyEntity = useAppSelector(state => state.history.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="historyDetailsHeading">History</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Id</span>
          </dt>
          <dd>{historyEntity.id}</dd>
          <dt>
            <span id="points">Points</span>
          </dt>
          <dd>{historyEntity.points}</dd>
          <dt>
            <span id="trophies">Trophies</span>
          </dt>
          <dd>{historyEntity.trophies}</dd>
          <dt>
            <span id="registeredAt">Registered At</span>
          </dt>
          <dd>{historyEntity.registeredAt}</dd>
          <dt>
            <span id="registeredBy">Registered By</span>
          </dt>
          <dd>{historyEntity.registeredBy}</dd>
          <dt>Book</dt>
          <dd>{historyEntity.book ? historyEntity.book.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/history" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/history/${historyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default HistoryDetail;
