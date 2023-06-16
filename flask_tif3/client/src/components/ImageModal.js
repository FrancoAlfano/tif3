import React, { useState } from 'react';
import Modal from 'react-modal';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdClose } from 'react-icons/md';

const ImageModal = ({ modalImageUrls, closeModal, csvContent }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const previousTab = () => {
    setCurrentTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const nextTab = () => {
    setCurrentTabIndex((prevIndex) => Math.min(prevIndex + 1, modalImageUrls.length - 1));
  };

  const currentContent = modalImageUrls[currentTabIndex];
  const isImageTab = currentTabIndex < modalImageUrls.length;
  const rows = csvContent.trim().split('\n').map(row => row.split(','));

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Image Modal">
      <div className="modal-container">
        <div className="modal-close" onClick={closeModal}>
          <MdClose className="modal-close-icon" size={40} />
        </div>
        <div className="tab-navigation">
          <div className="modal-buttons">
            <MdKeyboardArrowLeft
              className={`modal-button ${currentTabIndex === 0 ? 'disabled' : ''}`}
              onClick={previousTab}
              size={50}
            />
            <MdKeyboardArrowRight
              className={`modal-button ${currentTabIndex === modalImageUrls.length - 1 ? 'disabled' : ''}`}
              onClick={nextTab}
              size={50}
            />
          </div>
        </div>
        <div className="tab-content">
          <img src={currentContent} alt="" className="modal-image" />
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
