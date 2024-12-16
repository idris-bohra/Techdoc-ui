import React, { useEffect } from 'react';
import { ListGroup, Modal } from 'react-bootstrap';
import DeleteIcon from '@/assets/icons/delete-icon.svg';
import environmentsApiService from './environmentsApiService';
import { usePathname, useRouter } from 'next/navigation';
import './environments.scss';
import { useSelector } from 'react-redux';

import customPathnameHook from '../../customHook/customPathnameHook';
import { isOrgDocType } from '../common/utility';
import IconButton from '../common/iconButton';
import { MdDeleteOutline } from 'react-icons/md';

const EnvironmentModal = (props) => {
  const environment = useSelector((state) => state.environment);
  const router = useRouter();
  const location = customPathnameHook();

  useEffect(() => {
    const fetchEnvironments = async () => {
      let envs = {};
      if (environment && Object.keys(environment.environments)?.length) {
        envs = { ...environment.environments };
      } else {
        const { data } = await environmentsApiService.getEnvironments();
        envs = data;
      }

      if (location.state && location.state.editedEnvironment) {
        const { environmentId: environmentId, editedEnvironment } =
          location.state;
        router.push(location.pathname, {
          replace: true,
          state: { editedEnvironment: null },
        });
        envs = [
          ...envs.filter((env) => env.id !== environmentId),
          { id: environmentId, ...editedEnvironment },
        ];
        await environmentsApiService.updateEnvironment(
          environmentId,
          editedEnvironment
        );
      }
    };

    fetchEnvironments();
  }, [environment]);

  const handleEdit = (environment) => {
    props.handle_environment_modal('Edit Environment', environment);
  };

  const renderManageEnvironmentModal = () => {
    return Object.keys(environment.environments).map((environmentId) => (
      <div className='mb-2 d-flex justify-content-center' key={environmentId}>
        <ListGroup.Item
          style={{ width: '98%', float: 'left' }}
          key={environmentId}
          onClick={() => handleEdit(environment.environments[environmentId])}
        >
          {environment.environments[environmentId]?.name}
        </ListGroup.Item>
        <IconButton
          className='btn px-1'
          onClick={() => {
            props.open_delete_environment_modal(environmentId);
          }}
        >
          <MdDeleteOutline className='text-grey' size={18} />
        </IconButton>
      </div>
    ));
  };

  const renderNoEnvironmentModule = () => {
    return (
      <div className='align-items-center'>
        <div className='text-center m-2 align-items-center'>
          No Environment Available
        </div>
        <div className='justify-content-center d-flex text-center'>
          <button
            className='btn btn-outline orange p-2'
            onClick={() =>
              props.handle_environment_modal('Add new Environment')
            }
          >
            Add Environment
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      {...props}
      size='lg'
      animation={false}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header className='custom-collection-modal-container' closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          Manage Environments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup className='custom-environment-list-container h-auto'>
          {Object.keys(environment.environments)?.length === 0
            ? renderNoEnvironmentModule()
            : renderManageEnvironmentModal()}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default EnvironmentModal;
