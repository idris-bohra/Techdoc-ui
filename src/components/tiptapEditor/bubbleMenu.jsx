import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { SketchPicker } from 'react-color';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaHighlighter,
  FaLink,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
  FaAlignCenter,
  FaTable,
  FaUndo,
  FaRedo,
  FaListUl,
  FaListOl,
  FaRulerHorizontal,
  FaCode,
  FaHeading,
} from 'react-icons/fa';
import { GoTasklist } from 'react-icons/go';
import { Dropdown, Modal } from 'react-bootstrap';
import { BiFontColor, BiFontFamily } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuTextQuote,
} from 'react-icons/lu';
import UploadIcon from '@/assets/icons/uploadIcon.svg';
import pageApiService from '../pages/pageApiService';
import { FaImage } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa6';
import { LuFiles } from 'react-icons/lu';
import { RxSlash } from 'react-icons/rx';
import '../styles.scss';
import './tiptap.scss';

export default function BubbleMenuComponent({
  editor,
  pathData,
  pathName,
  loading,
  setLoading,
  showImage,
  setShowImage,
  showVideo,
  setShowVideo,
  showFiles,
  setShowFiles,
}) {
  const [alignment, setAlignment] = useState('left');
  const [color, setColor] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [VideoUrl, setVideoUrl] = useState('');
  const [FileUrl, setFileUrl] = useState('');
  const [row, setRow] = useState('3');
  const [column, setColumn] = useState('3');
  const [activeHeading, setActiveHeading] = useState(0);
  const [fileSizeVal, setFileSizeVal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const activeFontFamily = () => {
    const fontFamilies = [
      'Inter',
      'Comic Sans',
      'serif',
      'monospace',
      'cursive',
      'var(--title-font-family)',
    ];
    const activeFont = fontFamilies.find((font) =>
      editor.isActive('textStyle', { fontFamily: font })
    );
    return activeFont;
  };

  const getRandomColor = () => {
    const colors = [
      '#958DF1',
      '#F98181',
      '#FBBC88',
      '#FAF594',
      '#70CFF8',
      '#94FADB',
      '#B9F18D',
      '#C3E2C2',
      '#EAECCC',
      '#AFC8AD',
    ];
    return colors[Math.floor(Math.random() * colors?.length)];
  };
  const toggleHeading = (level) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level }).run();
      setActiveHeading(level);
    }
  };
  function onHide() {
    if (showImage) {
      setShowImage(false);
      setShowMenu(false);
    } else if (showVideo) {
      setShowVideo(false);
      setShowMenu(false);
    } else if (showFiles) {
      setShowFiles(false);
      setShowMenu(false);
    } else if (showLink) setShowLink(false);
    else setShowTable(false);
  }
  function handleTextColor(color) {
    setColor(color.hex);
    editor.chain().focus().setColor(color.hex).run();
  }
  const HeadingIcon = ({ level }) => {
    switch (level) {
      case 1:
        return <LuHeading1 />;
      case 2:
        return <LuHeading2 />;
      case 3:
        return <LuHeading3 />;
      case 4:
        return <LuHeading4 />;
      case 5:
        return <LuHeading5 />;
      case 6:
        return <LuHeading6 />;
      default:
        return <FaHeading />;
    }
  };
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files?.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('pathData', pathData);
    setLoading(true);
    try {
      const result = await pageApiService.uploadFiles(formData);
      result.data.files.forEach((item) => {
        if (showImage) {
          editor
            .chain()
            .focus()
            .insertContent(
              `<div><img src="${item.url}" alt="${item.originalName}" /><p></p></div>`
            )
            .run();
        } else if (showVideo) {
          editor.commands.setVideo(item.url);
        } else {
          editor
            .chain()
            .focus()
            .insertContent(
              `
                    <div>
                        <a href="${item.url}" target="_blank">
                            <strong>Open File: ${item.originalName}</strong>
                        </a>
                    </div>
                `
            )
            .run();
        }
        editor.commands.setTextSelection(editor.state.doc.content.size);
      });

      if (showImage) {
        setShowImage(false);
        setShowMenu(false);
      } else if (showVideo) {
        setShowVideo(false);
        setShowMenu(false);
      } else {
        setShowFiles(false);
        setShowMenu(false);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      onHide();
      console.error('Error uploading files:', error);
    }
  };

  const onFileChange = (e) => {
    const selectedFiles = e.target.files;
    let valid = true;

    for (let i = 0; i < selectedFiles?.length; i++) {
      const file = selectedFiles[i];
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB for videos, 5MB for other files

      if (file.size > maxSize) {
        valid = false;
        setFileSizeVal(true);
        setTimeout(() => {
          setFileSizeVal(false);
        }, 2000);
        e.target.value = '';
        break;
      }
    }
    if (valid && selectedFiles?.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  const getDisabledStyle = (disabled) =>
    disabled ? { cursor: 'not-allowed', opacity: 0.4 } : { cursor: 'pointer' };

  const renderUploadModule = (disabled) => (
    <>
      <div className='favicon-container'>
        <label
          className='font-icon mt-2 ml-3'
          style={getDisabledStyle(disabled)}
          htmlFor='upload-button'
        >
          <UploadIcon />
        </label>
        <input
          type='file'
          id='upload-button'
          disabled={disabled}
          style={{ display: 'none' }}
          multiple
          accept={
            showImage
              ? 'image/*'
              : showVideo
                ? 'video/*'
                : '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.csv,.ppt,.pptx'
          }
          onChange={(e) => onFileChange(e)}
        />
      </div>
    </>
  );

  function showModal() {
    const tippyBox = document.querySelector('.tippy-box');
    if (tippyBox) {
      if (showMenu) {
        tippyBox.classList.add('hidden');
      } else {
        tippyBox.classList.remove('hidden');
      }
    }
    return (
      <Modal
        show={showImage || showVideo || showFiles || showLink || showTable}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {showImage && 'Set Image URL'}
            {showVideo && 'Set Video URL'}
            {showFiles && 'Set File URL'}
            {showLink && 'Set Link'}
            {showTable && 'Add Number of rows and columns'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ height: '25vh', flexDirection: 'column' }}
            >
              <div
                className='spinner-border'
                role='status'
                style={{
                  borderColor: '#6c757d #6c757d #6c757d transparent',
                  width: '4rem',
                  height: '4rem',
                  borderWidth: '0.25rem',
                }}
              >
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {(showImage || showVideo || showFiles || showLink) && (
                <div className='form-group upload-modal mt-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='favicon-uploader mr-3'>
                      {renderUploadModule()}
                    </div>
                    <div className='mr-4 text-muted font-weight-bold'>OR</div>
                    <input
                      type='text'
                      className='form-control'
                      value={
                        showImage
                          ? ImageUrl
                          : showFiles
                            ? FileUrl
                            : showVideo
                              ? VideoUrl
                              : showLink
                      }
                      onChange={(e) => {
                        if (showImage) {
                          setImageUrl(e.target.value);
                        } else if (showFiles) {
                          setFileUrl(e.target.value);
                        } else if (showVideo) {
                          setVideoUrl(e.target.value);
                        } else {
                          setLinkUrl(e.target.value);
                        }
                      }}
                    />
                  </div>
                  {fileSizeVal ? (
                    <div
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        marginTop: '5px',
                        marginLeft: '100px',
                      }}
                    >
                      Your files exceeds the maximum file size limit.
                    </div>
                  ) : (
                    <div
                      style={{
                        color: 'black',
                        fontSize: '12px',
                        marginTop: '5px',
                        marginLeft: '100px',
                      }}
                    >
                      {' '}
                      *File Size Limit 20MB for videos and 5MB for all other
                      file types.
                    </div>
                  )}
                </div>
              )}
              {showTable && (
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Rows</label>
                      <input
                        className='form-control'
                        type='integer'
                        value={row}
                        onChange={(e) => setRow(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Columns</label>
                      <input
                        className='form-control'
                        type='integer'
                        value={column}
                        onChange={(e) => setColumn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        {!loading ? (
          <Modal.Footer>
            <button className='btn btn-secondary outline mr-2' onClick={onHide}>
              Close
            </button>
            <button
              className='btn btn-primary'
              onClick={() => {
                setLoading(true);
                if (showTable) {
                  editor
                    .chain()
                    .focus()
                    .insertTable({
                      rows: row,
                      cols: column,
                      withHeaderRow: true,
                    })
                    .run();
                  setShowTable(false);
                }
                if (showLink && linkUrl) {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: linkUrl })
                    .run();
                  setShowLink(false);
                }
                if (showVideo && VideoUrl) {
                  editor.commands.setVideo(VideoUrl);
                  setLoading(false);
                  setShowVideo(false);
                  setShowMenu(false);
                  setVideoUrl('');
                }
                if (showImage && ImageUrl) {
                  editor
                    .chain()
                    .focus()
                    .insertContent(`<img src="${ImageUrl}" alt="Image" />`)
                    .run();
                  setLoading(false);
                  setShowImage(false);
                  setShowMenu(false);
                  setImageUrl('');
                }
                if (showFiles && FileUrl) {
                  editor
                    .chain()
                    .focus()
                    .insertContent(
                      `
                                <a href="${FileUrl}" target="_blank">
                                    <strong>Open File: ${FileUrl.split('/').pop()}</strong>
                                </a>
                                <p></p>
                                `
                    )
                    .run();
                  setLoading(false);
                  setShowFiles(false);
                  setShowMenu(false);
                  setFileUrl('');
                }
              }}
            >
              Save
            </button>
          </Modal.Footer>
        ) : (
          <></>
        )}
      </Modal>
    );
  }

  return (
    <>
      <BubbleMenu
        className='bubble-menu px-2 border-0 d-flex align-items-center gap-1 justify-content-between p-1'
        tippyOptions={{ duration: 100 }}
        editor={editor}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`py-1 px-2 rounded m-0 editor.isActive('bold') ? 'is-active' : ''}`}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`py-1 px-2 rounded m-0 editor.isActive('italic') ? 'is-active' : ''}`}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`py-1 px-2 rounded m-0 editor.isActive('strike') ? 'is-active' : ''}`}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`py-1 px-2 rounded m-0 editor.isActive('underline') ? 'is-active' : ''}`}
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`py-1 px-2 rounded m-0 editor.isActive('highlight') ? 'is-active' : ''}`}
        >
          <FaHighlighter />
        </button>
        <Dropdown>
          <Dropdown.Toggle
            className='text-direction p-2'
            variant='light'
            id='alignment-dropdown'
          >
            {alignment === 'left' && <FaAlignLeft />}
            {alignment === 'center' && <FaAlignCenter />}
            {alignment === 'right' && <FaAlignRight />}
            {alignment === 'justify' && <FaAlignJustify />}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setAlignment('left');
                editor.chain().focus().setTextAlign('left').run();
              }}
              className='p-1'
            >
              <FaAlignLeft /> Left
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setAlignment('center');
                editor.chain().focus().setTextAlign('center').run();
              }}
              className='p-1'
            >
              <FaAlignCenter /> Center
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setAlignment('right');
                editor.chain().focus().setTextAlign('right').run();
              }}
              className='p-1'
            >
              <FaAlignRight /> Right
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setAlignment('justify');
                editor.chain().focus().setTextAlign('justify').run();
              }}
              className='p-1'
            >
              <FaAlignJustify /> Justify
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='create-table rounded'>
          <Dropdown.Toggle className='btn-light text-direction bg-transparent p-2'>
            {activeFontFamily()} <BiFontFamily />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('Inter').run()
              }
              className={`p-1 ${editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}`}
              data-test-id='inter'
            >
              Inter
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('Comic Sans').run()
              }
              className={`p-1
                                editor.isActive('textStyle', { fontFamily: 'Comic Sans' })
                                    ? 'is-active'
                                    : ''}`}
              data-test-id='comic-sans'
            >
              Comic Sans
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('serif').run()
              }
              className={`p-1 editor.isActive('textStyle', { fontFamily: 'serif' }) ? 'is-active' : ''}`}
              data-test-id='serif'
            >
              Serif
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('monospace').run()
              }
              className={`p-1 editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'is-active' : ''}`}
              data-test-id='monospace'
            >
              Monospace
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('cursive').run()
              }
              className={`p-1 editor.isActive('textStyle', { fontFamily: 'cursive' }) ? 'is-active' : ''}`}
              data-test-id='cursive'
            >
              Cursive
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setFontFamily('var(--title-font-family)')
                  .run()
              }
              className={`p-1 editor.isActive('textStyle', { fontFamily: 'var(--title-font-family)' }) ? 'is-active' : ''}`}
              data-test-id='css-variable'
            >
              CSS variable
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setFontFamily('"Comic Sans"').run()
              }
              className={`p-1 editor.isActive('textStyle', { fontFamily: '"Comic Sans"' }) ? 'is-active' : ''}`}
              data-test-id='comic-sans-quoted'
            >
              Comic Sans quoted
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='create-table rounded'>
          <Dropdown.Toggle className='btn-light text-direction bg-transparent p-2'>
            <BiFontColor />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <SketchPicker
              color={getRandomColor()}
              onChangeComplete={handleTextColor}
            />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='create-table rounded'>
          <Dropdown.Toggle className='p-2 btn-light text-direction bg-transparent'>
            <FaTable />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowTable(true)} className='p-1'>
              Create Table
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className='p-1'
            >
              Add Row Before
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className='p-1'
            >
              Add Row After
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().deleteRow().run()}
              className='p-1'
            >
              Delete Row
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className='p-1'
            >
              Delete Column
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className='p-1'
            >
              Add Column Before
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className='p-1'
            >
              Add Column After
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().mergeCells().run()}
              className='p-1'
            >
              Merge Cell
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().splitCell().run()}
              className='p-1'
            >
              Split Cell
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().deleteTable().run()}
              className='p-1'
            >
              Delete Table
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle
            className='text-direction p-2'
            variant='light'
            id='heading-dropdown'
          >
            <HeadingIcon level={activeHeading} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[1, 2, 3, 4, 5, 6]?.map((level) => (
              <Dropdown.Item key={level} className='p-1 text-black'>
                <button
                  onClick={() => toggleHeading(level)}
                  className={`font-12 text-black editor.isActive('heading', { level }) ? 'is-active' : ''}`}
                >
                  <HeadingIcon level={level} /> Heading{level}
                </button>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle
            className='text-direction p-2'
            variant='light'
            id='additional-options-dropdown'
          >
            <BsThreeDots />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => editor.chain().focus().undo().run()}
              className='p-1'
            >
              <FaUndo /> Undo
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().redo().run()}
              className='p-1'
            >
              <FaRedo /> Redo
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 editor.isActive('bulletList') ? 'is-active' : ''}`}
            >
              <FaListUl /> Bullet List
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 editor.isActive('orderedList') ? 'is-active' : ''}`}
            >
              <FaListOl /> Numbered List
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-1 editor.isActive('taskList') ? 'is-active' : ''}`}
            >
              <GoTasklist /> Task list
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className='p-1'
            >
              <FaRulerHorizontal /> Horizontal Rule
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1 editor.isActive('codeBlock') ? 'is-active' : ''}`}
            >
              <FaCode /> Code Block
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1 editor.isActive('blockquote') ? 'is-active' : ''}`}
            >
              <LuTextQuote /> Quote
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setShowImage(true);
                setShowMenu(true);
              }}
              className='p-1'
            >
              <FaImage /> Images
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setShowVideo(true);
                setShowMenu(true);
              }}
              className='p-1'
            >
              <FaVideo /> Videos
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setShowFiles(true);
                setShowMenu(true);
              }}
              className='p-1'
            >
              <LuFiles /> Files
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                editor.chain().focus().setBreadcrumb(pathData, pathName).run()
              }
              className='p-1'
            >
              <RxSlash /> BreadCrumb
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </BubbleMenu>
      {showModal()}
    </>
  );
}
