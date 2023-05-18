import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageModal = ({ modalImageUrls, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const currentImageUrl = modalImageUrls[currentImageIndex];

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Image Modal">
      <div className="modal-container">
        <img src={currentImageUrl} alt="" className="modal-image" />
        <button onClick={previousImage} disabled={currentImageIndex === 0}>
          Previous
        </button>
        <button onClick={nextImage} disabled={currentImageIndex === modalImageUrls.length - 1}>
          Next
        </button>
        <button onClick={closeModal}>Close Modal</button>
      </div>
    </Modal>
  );
};

export default ImageModal;
