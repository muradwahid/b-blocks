const PreSelectFormSkeleton = ({ handleReplaceForm }) => {



  return <div className='b-blocks-b-form-preselectFormSkeleton-wrapper'>

    <div className="b-blocks-b-form-skeleton-wrapper">
      <div onClick={() => handleReplaceForm('register')}>
      <div className="b-blocks-b-form-skeleton">
        <div className="b-blocks-b-form-skeleton-field"></div>
        <div className="b-blocks-b-form-skeleton-field"></div>
        <div className="b-blocks-b-form-skeleton-field"></div>
        <div className="b-blocks-b-form-skeleton-button-wrapper">
          <div></div>
          <div></div>
        </div>
        </div>
        <p className="b-blocks-b-form-skeleton-form-title">Register Form</p>
      </div>
      <div onClick={() => handleReplaceForm('login')}>
      <div className="b-blocks-b-form-skeleton">
        <div className="b-blocks-b-form-skeleton-field"></div>
        <div className="b-blocks-b-form-skeleton-field"></div>
        <div className="b-blocks-b-form-skeleton-button-wrapper">
          <div></div>
        </div>
      </div>
        <p className="b-blocks-b-form-skeleton-form-title">Login Form</p>
      </div>
    </div>
    <div>

    </div>

      
    </div>
};

export default PreSelectFormSkeleton;
