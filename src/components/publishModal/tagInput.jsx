import React, { useEffect, useState } from 'react';
import './tagInput.scss';
import { updateEndpoint, updatePage } from '../pages/redux/pagesActions';
import { useDispatch, useSelector } from 'react-redux';

const TagInput = (props) => {
  const { pages, page, activeTabId } = useSelector((state) => ({
    pages: state.pages,
    page: state?.pages[state.tabs.activeTabId],
    activeTabId: state.tabs.activeTabId,
  }));
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setTags(page?.meta?.tags || []);
  }, [activeTabId, page]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTag = () => {
    if (inputValue.trim()) {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      setInputValue('');
      setIsExpanded(true);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag();
    }
    const updatedMeta = { ...page.meta, tags };
    const editedPage = { ...pages?.[props.pageId], meta: updatedMeta };
    dispatch(updatePage(editedPage));
    setIsFocused(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTag();
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
    if (updatedTags?.length === 0) {
      setIsExpanded(false);
    }
    const updatedMeta = { ...page.meta, tags: updatedTags };
    const editedPage = { ...pages?.[props.pageId], meta: updatedMeta };
    dispatch(updatePage(editedPage));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div
      className={`tag-input-container mt-4 p-8 ${isFocused || tags?.length > 0 ? 'focused' : ''} ${isExpanded ? 'expanded' : ''}`}
    >
      <label
        className={`floating-label ${isFocused || tags?.length > 0 ? 'active' : ''}`}
      >
        Tags
      </label>

      <div className='tag-list d-flex'>
        {tags.map((tag, index) => (
          <div
            key={index}
            className='tag align-items-center p-1 font-14 ml-2 mt-2'
          >
            {tag}
            <span
              className='tag-close ml-2 cursor-pointer'
              onClick={() => handleRemoveTag(index)}
            >
              &times;
            </span>
          </div>
        ))}
        <input
          className='tag-input-field p-1 font-14'
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleFocus}
        />
      </div>
    </div>
  );
};

export default TagInput;
