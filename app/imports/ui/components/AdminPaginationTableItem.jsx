import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the FAQStats (Admin) table. See pages/AdminPage.jsx. */
const AdminPaginationTableItem = ({ page }) => {
  if (page) {
    return (
      <tr className="shadow-lg p-3 mb-5 bg-body rounded">
        <td>{page.filename}</td>
        <td>{page.question}</td>
        <td>{page.freq}</td>
      </tr>
    );
  }

  return (
    <tr>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
  );

};

// Require a document to be passed to this component.
AdminPaginationTableItem.propTypes = {
  page: PropTypes.shape({
    filename: PropTypes.string,
    question: PropTypes.string,
    freq: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default AdminPaginationTableItem;
