'use client';
import React, { useEffect, useRef } from 'react';
import { FaImage } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa6';
import { LuFiles } from 'react-icons/lu';
import { RxSlash } from 'react-icons/rx';
import {
  FaListUl,
  FaListOl,
  FaRulerHorizontal,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaCode,
} from 'react-icons/fa';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuTextQuote,
  LuSquareEqual,
} from 'react-icons/lu';
import { GoTasklist } from 'react-icons/go';
import { BsSearch } from 'react-icons/bs';
import { GrDocumentPerformance } from 'react-icons/gr';
import '../styles.scss';
import './tiptap.scss';

export default function ShowSlashMenuComponent({
  editor,
  pathData,
  pathName,
  showSlashMenu,
  setShowSlashMenu,
  activeSlashMenuIndex,
  setActiveSlashMenuIndex,
  slashMenuPosition,
  searchQuery,
  setSearchQuery,
  setShowImage,
  setShowVideo,
  setShowFiles,
  setShowModal,
  linkedPage,
}) {
  const slashMenuRefs = useRef([]);
  const searchInputRef = useRef(null);

  const blockTypes = [
    {
      type: 'heading-1',
      icon: <LuHeading1 size={20} />,
      label: 'Heading 1',
      description: 'Big section heading',
    },
    {
      type: 'heading-2',
      icon: <LuHeading2 size={20} />,
      label: 'Heading 2',
      description: 'Medium section heading',
    },
    {
      type: 'heading-3',
      icon: <LuHeading3 size={20} />,
      label: 'Heading 3',
      description: 'Small section heading',
    },
    {
      type: 'task-list',
      icon: <GoTasklist size={20} />,
      label: 'Task List',
      description: 'Track tasks with a to-do list',
    },
    {
      type: 'bulletList',
      icon: <FaListUl size={20} />,
      label: 'Bullet List',
      description: 'Create a simple bulleted list',
    },
    {
      type: 'numberedList',
      icon: <FaListOl size={20} />,
      label: 'Numbered List',
      description: 'Create a list with numbering',
    },
    {
      type: 'left',
      icon: <FaAlignLeft size={20} />,
      label: 'Left',
      description: 'Align your content to the left',
    },
    {
      type: 'right',
      icon: <FaAlignRight size={20} />,
      label: 'Right',
      description: 'Align your content to the right',
    },
    {
      type: 'center',
      icon: <FaAlignCenter size={20} />,
      label: 'Center',
      description: 'Align your content to the center',
    },
    {
      type: 'justify',
      icon: <FaAlignJustify size={20} />,
      label: 'Justify',
      description: 'Align your content to justify',
    },
    {
      type: 'codeBlock',
      icon: <FaCode size={20} />,
      label: 'Code Block',
      description: 'Insert a code block',
    },
    {
      type: 'blockquote',
      icon: <LuTextQuote size={20} />,
      label: 'Blockquote',
      description: 'Insert a quote block',
    },
    {
      type: 'rule',
      icon: <FaRulerHorizontal size={20} />,
      label: 'Horizontal Rule',
      description: 'Insert a horizontal rule',
    },
    {
      type: 'image',
      icon: <FaImage size={20} />,
      label: 'Images',
      description: 'Upload Images',
    },
    {
      type: 'video',
      icon: <FaVideo size={20} />,
      label: 'Videos',
      description: 'Upload Videos',
    },
    {
      type: 'files',
      icon: <LuFiles size={20} />,
      label: 'Files',
      description: 'Upload Files',
    },
    {
      type: 'breadcrumb',
      icon: <RxSlash size={20} />,
      label: 'Breadcrumb',
      description: 'Create Breadcrumb',
    },
    {
      type: 'callout',
      icon: <LuSquareEqual size={20} />,
      label: 'CallOut',
      description: 'Make writing stand out',
    },
    {
      type: 'linkedpages',
      icon: <GrDocumentPerformance size={20} />,
      label: 'Link To Page',
      description: 'Create LinkedPages',
    },
  ];

  useEffect(() => {
    if (showSlashMenu) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest('.slash-menu')) {
          setShowSlashMenu(false);
        }
      };
      const handleArrowNavigation = (e) => {
        const totalMenuItems = filteredBlockTypes?.length;
        if (totalMenuItems > 1 && e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (activeSlashMenuIndex + 1) % totalMenuItems;
          setActiveSlashMenuIndex(nextIndex);
          slashMenuRefs.current[nextIndex]?.focus();
        } else if (totalMenuItems > 1 && e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex =
            (activeSlashMenuIndex - 1 + totalMenuItems) % totalMenuItems;
          setActiveSlashMenuIndex(prevIndex);
          slashMenuRefs.current[prevIndex]?.focus();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (totalMenuItems === 1) {
            handleItemClick(filteredBlockTypes[0].type);
          } else {
            handleItemClick(filteredBlockTypes[activeSlashMenuIndex].type);
          }
          setShowSlashMenu(false);
          setActiveSlashMenuIndex(-1);
        }
      };

      window.addEventListener('keydown', handleArrowNavigation);
      window.addEventListener('click', handleOutsideClick);

      return () => {
        window.removeEventListener('click', handleOutsideClick);
        window.removeEventListener('keydown', handleArrowNavigation);
      };
    }
  }, [showSlashMenu, activeSlashMenuIndex]);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const filteredBlockTypes = blockTypes.filter(
    (item) =>
      searchQuery === '' ||
      item.label.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredBlockTypes?.length === 1) {
      setActiveSlashMenuIndex(0);
    }
  }, [filteredBlockTypes]);

  const insertBlock = (type) => {
    if (!editor) return;
    const { from } = editor.state.selection;

    const textBeforeSlash = editor.state.doc.textBetween(from - 1, from, ' ');

    if (textBeforeSlash === '/') {
      editor.commands.deleteRange({ from: from - 1, to: from });
    }

    switch (type) {
      case 'heading-1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading-2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading-3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'task-list':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numberedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'rule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'left':
      case 'right':
      case 'center':
      case 'justify':
        editor.chain().focus().setTextAlign(type).run();
        break;
      case 'linkedpages':
        editor.chain().focus().setLinkedPages(linkedPage).run();
      default:
        break;
    }

    setShowSlashMenu(false);
  };

  const handleItemClick = (type) => {
    if (!editor) return;

    switch (type) {
      case 'heading-1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading-2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading-3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'task-list':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numberedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'rule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'left':
      case 'right':
      case 'center':
      case 'justify':
        editor.chain().focus().setTextAlign(type).run();
        break;
      case 'image':
        setShowImage(true);
        insertBlock();
        break;
      case 'video':
        setShowVideo(true);
        insertBlock();
        break;
      case 'files':
        setShowFiles(true);
        insertBlock();
        break;
      case 'breadcrumb':
        editor.chain().focus().setBreadcrumb(pathData, pathName).run();
        insertBlock();
        break;
      case 'callout':
        editor.commands.setCallout({ type: 'important' });
        break;
      case 'linkedpages':
        setShowModal(true);
        break;
      default:
        break;
    }

    setShowSlashMenu(false);
  };

  return (
    <>
      <div
        className='slash-menu position-absolute align-items-center d-flex flex-column py-2 bg-white'
        style={{
          top: `${slashMenuPosition.top}px`,
          left: `${slashMenuPosition.left}px`,
        }}
      >
        <div className='slash-menu-container'>
          <div className='search-bar d-flex align-items-center m-2'>
            <span className='search-icon mr-2 ml-2 align-items-center justify-content-between'>
              <BsSearch />
            </span>
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ul className='overflow-auto p-0 m-0 w-100'>
          {filteredBlockTypes.length === 0 ? (
            <div className='no-matches text-muted align-items-center d-flex cursor-pointer px-4 py-2'>
              No matches found
            </div>
          ) : (
            filteredBlockTypes.map((item, index) => (
              <li
                key={index}
                className='align-items-center d-flex cursor-pointer px-4 py-2'
                tabIndex='0'
                ref={(el) => (slashMenuRefs.current[index] = el)}
                onClick={() => handleItemClick(item.type)}
              >
                {item.icon}
                <div className='ml-4'>
                  <span className='d-flex font-14 fw-500'>{item.label}</span>
                  <span className='menu-description mt-1 font-12'>
                    {item.description}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
