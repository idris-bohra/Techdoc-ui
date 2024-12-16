import React from 'react';
import { Modal } from 'react-bootstrap';
import Editor from '@/components/codeEditor/editor';

function ShowHeaderFooterPreviewModal(props) {
  return (
    <Modal
      show={props?.show}
      animation={false}
      centered
      dialogClassName='w-100 customized-header-footer-model'
    >
      <Modal.Body>
        <Editor
          tabs={props?.tabs}
          header={props?.header}
          footer={props?.footer}
          onHide={() => props?.onHide()}
          setHeader={(event) => props?.setHeader(event)}
          setFooter={(event) => props?.setFooter(event)}
          saveAndPublishCollection={() => props?.saveAndPublishCollection()}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ShowHeaderFooterPreviewModal;
