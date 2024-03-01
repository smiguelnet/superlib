import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavDropdown } from './menu-components';

const adminMenuItems = () => (
  <>
    <MenuItem icon="asterisk" to="/book">
      Gestão de Livros
    </MenuItem>
    <MenuItem icon="asterisk" to="/category">
      Gestão de Categories
    </MenuItem>
    <MenuItem icon="users" to="/admin/user-management">
      Gestão de Usuários
    </MenuItem>
    <MenuItem icon="asterisk" to="/history">
      Log de Acesso dos Usuários
    </MenuItem>

    {/*<MenuItem icon="tachometer-alt" to="/admin/metrics">*/}
    {/*  Metrics*/}
    {/*</MenuItem>*/}
    <MenuItem icon="heart" to="/admin/health">
      Status do Sistema
    </MenuItem>
    {/*<MenuItem icon="cogs" to="/admin/configuration">*/}
    {/*  Configuration*/}
    {/*</MenuItem>*/}
    {/*<MenuItem icon="tasks" to="/admin/logs">*/}
    {/*  Logs*/}
    {/*</MenuItem>*/}
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
  </>
);

const openAPIItem = () => (
  <MenuItem icon="book" to="/admin/docs">
    API
  </MenuItem>
);

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name="Gestão do Sistema" id="admin-menu" data-cy="adminMenu">
    {adminMenuItems()}
    {/*{showOpenAPI && openAPIItem()}*/}
  </NavDropdown>
);

export default AdminMenu;
