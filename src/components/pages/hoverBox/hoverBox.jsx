'use client';
import React, { useEffect, useState } from 'react';
import './hoverBox.scss';

export default function HoverBox({ html }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    addIdsToHeadings(html);
  }, []);

  const addIdsToHeadings = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headings = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.setAttribute('id', id);
      return {
        id,
        text: heading.innerText,
        tag: heading.tagName.toLowerCase(),
      };
    });
    setHeadings(headings);
    return doc.body.innerHTML;
  };

  const scrollToHeading = (headingId) => {
    document
      .getElementById(headingId)
      .scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
  };

  return (
    <React.Fragment>
      {headings?.length > 0 && (
        <div className='heading-main px-4'>
          <h6 className='table-content-heading'>TABLE OF CONTENTS</h6>
          <div className='editor-headings rounded-sm d-flex flex-column'>
            {headings.map((heading) => (
              <span
                onClick={() => scrollToHeading(heading.id)}
                className=' m-0 p-1 cursor-pointer content-heading'
              >
                {heading.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
