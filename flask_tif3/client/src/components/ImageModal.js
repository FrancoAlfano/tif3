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
          <button onClick={previousTab} disabled={currentTabIndex === 0}>
            Previous
          </button>
          <button onClick={nextTab} disabled={currentTabIndex === modalImageUrls.length}>
            Next
          </button>
          </div>
        </div>
        <div className="tab-content">
          {isImageTab ? (
            <img src={currentContent} alt="" className="modal-image" />
          ) : (
            <div className="csv-content">
            <h2 className="csv-content__heading">Frequency</h2>
            <table className="csv-content__table">
              <thead>
                <tr>
                  {rows[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
        <div className='modal-buttons'>
          <button onClick={closeModal}>Close Modal</button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
