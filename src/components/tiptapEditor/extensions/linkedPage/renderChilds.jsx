import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaLongArrowAltRight } from 'react-icons/fa';

export default function RenderChilds({
  linkedPage,
  setLinkedPage,
  setSelectedPage,
}) {
  const { pages, collections } = useSelector((state) => ({
    pages: state.pages,
    collections: state.collections,
  }));

  const [listData, setListData] = useState([]);

  useEffect(() => {
    const currentId = linkedPage[linkedPage?.length - 1];
    const currentPage = pages?.[currentId];

    if (linkedPage?.length === 1) {
      const collectionId = currentId;
      const rootPageId = collections?.[collectionId]?.rootParentId;
      setListData(
        pages?.[rootPageId]?.child?.filter(
          (childId) => pages?.[childId]?.type !== 4
        ) || []
      );
    } else if (currentPage) {
      setListData(
        currentPage.child?.filter((childId) => pages?.[childId]?.type !== 4) ||
          []
      );
    }
  }, [linkedPage, pages, collections]);

  const getType = (id) => {
    const type = pages?.[id]?.type;
    switch (type) {
      case 1:
      case 3:
        return 'page';
      case 2:
        return 'version';
      case 4:
        return 'endpoint';
      default:
        return 'collection';
    }
  };

  const addIdInPathdata = (id, slug) => {
    if (slug === 'collection') {
      const rootPageId = collections?.[id]?.rootParentId;
      setLinkedPage((prev) => [...prev, rootPageId]);
      setListData(
        pages?.[rootPageId]?.child?.filter(
          (childId) => pages?.[childId]?.type !== 2
        ) || []
      );
    } else {
      setLinkedPage((prev) => [...prev, id]);
      setListData(
        pages?.[id]?.child?.filter((childId) => pages?.[childId]?.type !== 2) ||
          []
      );
    }
  };

  return (
    <div>
      {listData?.map((singleId, index) => {
        const type = getType(singleId);
        const childrenExist =
          pages?.[singleId]?.child && pages?.[singleId]?.child.length > 0;
        const handleSelect = () =>
          setSelectedPage({ id: singleId, name: pages?.[singleId]?.name });
        if (type === 'page') {
          return (
            <div
              key={index}
              className={`folder-box d-flex align-items-center justify-content-between p-1`}
            >
              <div className='d-flex'>
                <IoDocumentTextOutline className='text-grey' size='14px' />
                <div onClick={handleSelect} className='ml-1 font-12'>
                  {pages?.[singleId]?.name}
                </div>
              </div>
              {childrenExist && (
                <div
                  onClick={() => addIdInPathdata(singleId)}
                  className='ml-2 font-12'
                >
                  <FaLongArrowAltRight />
                </div>
              )}
            </div>
          );
        } else if (type === 'version') {
          return pages?.[singleId]?.child.map((childId, childIndex) => {
            const childExist =
              pages?.[childId]?.child && pages?.[childId]?.child.length > 0;

            return (
              <div
                key={childIndex}
                className={`folder-box d-flex align-items-center justify-content-between p-1`}
              >
                <div className='d-flex align-items-center'>
                  <IoDocumentTextOutline className='text-grey' size='14px' />
                  <div
                    onClick={() =>
                      setSelectedPage({
                        id: childId,
                        name: pages?.[childId]?.name,
                      })
                    }
                    className='ml-1 font-12'
                  >
                    {pages?.[childId]?.name}
                  </div>
                </div>
                {childExist && (
                  <div
                    onClick={() => {
                      addIdInPathdata(childId), setSelectedPage(null);
                    }}
                    className='ml-2 font-12'
                  >
                    <FaLongArrowAltRight />
                  </div>
                )}
              </div>
            );
          });
        } else if (type === 'endpoint') {
          return (
            <div
              key={index}
              className='folder-box d-flex justify-content-start align-items-center p-1'
            >
              <div
                className={`api-label ${pages?.[singleId]?.requestType} request-type-bgcolor`}
              >
                {pages?.[singleId]?.requestType}
              </div>
              <div className='ml-1 font-12'>{pages?.[singleId]?.name}</div>
            </div>
          );
        } else return null;
      })}
    </div>
  );
}
