import book from 'app/entities/book/book.reducer';
import category from 'app/entities/category/category.reducer';
import history from 'app/entities/history/history.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  book,
  category,
  history,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
