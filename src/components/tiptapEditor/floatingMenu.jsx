import React from 'react';
import { FloatingMenu } from '@tiptap/react';
import { Dropdown } from 'react-bootstrap';
import { BiPlus } from 'react-icons/bi';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuTextQuote,
  LuFiles,
  LuSquareEqual,
} from 'react-icons/lu';
import { FaListUl, FaListOl, FaImage } from 'react-icons/fa';
import { RxSlash } from 'react-icons/rx';
import { FaVideo } from 'react-icons/fa6';
import { GoTasklist } from 'react-icons/go';
import '../styles.scss';
import './tiptap.scss';

export default function FloatingMenuComponent({
  editor,
  showImage,
  setShowImage,
  pathData,
  pathName,
  showVideo,
  setShowVideo,
  showFiles,
  setShowFiles,
}) {
  return (
    <FloatingMenu
      className='floating-menu'
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <Dropdown>
        {!showImage && !showVideo && !showFiles ? (
          <Dropdown.Toggle
            variant='light'
            id='dropdown-basic'
            className='biplus-icon p-1 rounded-circle'
          >
            <BiPlus size={18} />
          </Dropdown.Toggle>
        ) : (
          ''
        )}
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <LuHeading1 /> Heading 1
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <LuHeading2 /> Heading 2
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <LuHeading3 /> Heading 3
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FaListUl /> Bullet List
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FaListOl /> Numbered List
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <GoTasklist /> Task List
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            <LuTextQuote /> Quote
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowImage(true)}>
            <FaImage /> Images
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowVideo(true)}>
            <FaVideo /> Videos
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowFiles(true)}>
            <LuFiles /> Files
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              editor.chain().focus().setBreadcrumb(pathData, pathName).run()
            }
          >
            <RxSlash /> BreadCrumb
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => editor.commands.setCallout({ type: 'important' })}
          >
            <LuSquareEqual /> Callout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </FloatingMenu>
  );
}
