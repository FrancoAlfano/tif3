import React from 'react';
import Modal from 'react-modal';

const ImageModal = ({ modalImageUrl, closeModal }) => {
  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Image Modal">
      <img src={modalImageUrl} alt="Image" />
      <button onClick={closeModal}>Close Modal</button>
    </Modal>
  );
};

export default ImageModal;
