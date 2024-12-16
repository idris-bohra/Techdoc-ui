import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { CiImport } from 'react-icons/ci';
import './dragAndDropUploader.scss';
import { importEnvironment } from '../../environments/redux/environmentsActions';
import { importCollection } from '../../collections/redux/collectionsActions';
import { addIsExpandedAction } from '../../../store/clientData/clientDataActions';
import { getCurrentOrg } from '@/components/auth/authServiceV2';
import Loader from '../common/Loader.jsx'; // Import your loader component

const DragAndDropUploader = ({ onClose, view, importType }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const currentOrg = getCurrentOrg();

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
  }, []);

  const handleImport = async () => {
    setLoading(true); // Start loader
    const uploadedFile = new FormData();
    uploadedFile.append('myFile', file, fileName);

    try {
      if (importType === 'environment') {
        await dispatch(importEnvironment(uploadedFile, onClose));
      }
      if (importType === 'collection') {
        const orgDetails = { orgName: currentOrg?.name };
        const result = await dispatch(
          importCollection(
            uploadedFile,
            undefined,
            onClose,
            view ? view : 'testing',
            orgDetails
          )
        );
        if (result?.collection) {
          dispatch(
            addIsExpandedAction({ value: true, id: result?.collection?.id })
          );
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className='drag-and-drop-uploader'>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className='upload-icon'>
          <CiImport size={50} />
        </div>
        <div className='upload-text'>
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drop anywhere to import
              <br />
              or select <span className='file-link'>files</span>
            </p>
          )}
        </div>
      </div>
      {fileName && (
        <div className='file-info'>
          <p>Selected file: {fileName}</p>
        </div>
      )}
      {loading ? ( // Display loader when loading
        <Loader size='40px' color='#3498db' style={{ marginTop: '20px' }} />
      ) : (
        <button
          onClick={handleImport}
          className='btn btn-primary mt-3 btn-sm font-12'
          disabled={!file}
        >
          Import
        </button>
      )}
    </div>
  );
};

export default DragAndDropUploader;
