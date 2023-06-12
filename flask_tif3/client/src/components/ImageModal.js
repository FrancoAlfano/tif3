import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageModal = ({ modalImageUrls, closeModal, csvContent }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const previousTab = () => {
    setCurrentTabIndex((prevIndex) => prevIndex - 1);
  };

  const nextTab = () => {
    setCurrentTabIndex((prevIndex) => prevIndex + 1);
  };

  const currentContent = modalImageUrls[currentTabIndex];
  const isImageTab = currentTabIndex < modalImageUrls.length;
  const rows = csvContent.trim().split('\n').map(row => row.split(','));

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Image Modal">
      <div className="modal-container">
        <div className="tab-navigation">
          <div className='modal-buttons'>
          <button className='modal-button' onClick={previousTab} disabled={currentTabIndex === 0}>
            Previous
          </button>
          <button onClick={nextTab} className='modal-button' disabled={currentTabIndex === modalImageUrls.length - 1}>
            Next
          </button>
          </div>
        </div>
        <div className="tab-content">
            <img src={currentContent} alt="" className="modal-image" />
        </div>
        <br></br>
        <div className='modal-buttons'>
          <button onClick={closeModal} className='modal-button-close'>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
