import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBook } from 'app/shared/model/book.model';
import { getEntities as getBooks } from 'app/entities/book/book.reducer';
import { IHistory } from 'app/shared/model/history.model';
import { getEntity, updateEntity, createEntity, reset } from './history.reducer';

export const HistoryUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const books = useAppSelector(state => state.book.entities);
  const historyEntity = useAppSelector(state => state.history.entity);
  const loading = useAppSelector(state => state.history.loading);
  const updating = useAppSelector(state => state.history.updating);
  const updateSuccess = useAppSelector(state => state.history.updateSuccess);

  const handleClose = () => {
    navigate('/history');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getBooks({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.points !== undefined && typeof values.points !== 'number') {
      values.points = Number(values.points);
    }
    if (values.trophies !== undefined && typeof values.trophies !== 'number') {
      values.trophies = Number(values.trophies);
    }
    if (values.registeredAt !== undefined && typeof values.registeredAt !== 'number') {
      values.registeredAt = Number(values.registeredAt);
    }

    const entity = {
      ...historyEntity,
      ...values,
      book: books.find(it => it.id.toString() === values.book.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...historyEntity,
          book: historyEntity?.book?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="superlibApp.history.home.createOrEditLabel" data-cy="HistoryCreateUpdateHeading">
            Create or edit a History
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="history-id" label="Id" validate={{ required: true }} /> : null}
              <ValidatedField label="Points" id="history-points" name="points" data-cy="points" type="text" />
              <ValidatedField label="Trophies" id="history-trophies" name="trophies" data-cy="trophies" type="text" />
              <ValidatedField label="Registered At" id="history-registeredAt" name="registeredAt" data-cy="registeredAt" type="text" />
              <ValidatedField label="Registered By" id="history-registeredBy" name="registeredBy" data-cy="registeredBy" type="text" />
              <ValidatedField id="history-book" name="book" data-cy="book" label="Book" type="select">
                <option value="" key="0" />
                {books
                  ? books.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/history" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HistoryUpdate;
