'use client';
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { getOrgId } from '../common/utility';
import { useSelector } from 'react-redux';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Blockquote from '@tiptap/extension-blockquote';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import FontFamily from '@tiptap/extension-font-family';
import Dropcursor from '@tiptap/extension-dropcursor';
import Typography from '@tiptap/extension-typography';
import ImageResize from 'tiptap-extension-resize-image';
import FloatingMenuComponent from './floatingMenu';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import BubbleMenuComponent from './bubbleMenu';
import PageLoader from '@/components/pages/pageLoader';
import Breadcrumb from './extensions/breadCrumbExtension';
import Video from './extensions/VideoExtension';
import ShowSlashMenuComponent from './slashMenu';
import CalloutExtension from './extensions/calloutExtension';
import LinkedPages from './extensions/linkedPagesExtension';
import LinkedPageModal from './extensions/linkedPage/linkedPageModal';
import LinkedPage from './extensions/linkedPagesExtension';
import '../styles.scss';
import './tiptap.scss';

export default function Tiptap({
  provider,
  ydoc,
  isInlineEditor,
  disabled,
  initial,
  onChange,
  isEndpoint = false,
  pathData,
  pathName,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [clickedRange, setClickedRange] = useState(null);

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
    tip: '💡',
    important: '📌',
  };

  const { currentUser, pages } = useSelector((state) => ({
    currentUser: state.users.currentUser,
    pages: state.pages,
    collections: state.collections,
  }));

  const router = useRouter();

  useEffect(() => {
    if (provider) {
      setIsLoading(true);

      provider.on('synced', ({ state }) => {
        setIsLoading(false);
        console.log('Document synced:', state);
      });
    }
  }, [provider]);

  function handleBreadcrumbClick(event) {
    const orgID = getOrgId();
    const breadcrumbSegmentId = event.target.getAttribute('id');
    const Id = breadcrumbSegmentId.split('/');
    if (Id[0] === 'collection') {
      router.push(`/orgs/${orgID}/dashboard/collection/${Id[1]}/settings`);
    } else {
      router.push(`/orgs/${orgID}/dashboard/page/${Id[1]}`);
    }
  }
  function handleLinkedPageClick(event) {
    const orgID = getOrgId();
    const linkedPageId = event.target.getAttribute('data-page-id');
    if (pages[linkedPageId]?.type == 4) {
      router.push(`/orgs/${orgID}/dashboard/endpoint/${linkedPageId}`);
    } else {
      router.push(`/orgs/${orgID}/dashboard/page/${linkedPageId}`);
    }
  }
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

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [activeSlashMenuIndex, setActiveSlashMenuIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [linkedPage, setLinkedPage] = useState(['currentOrganisation']);

  useEffect(() => {
    if (!showSlashMenu) {
      setSearchQuery('');
    } else {
      setActiveSlashMenuIndex(-1);
    }
  }, [showSlashMenu]);

  const NonEditableLink = Link.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        contenteditable: {
          default: 'false',
          parseHTML: () => 'false',
          renderHTML: () => {
            return {
              contenteditable: 'false',
            };
          },
        },
      };
    },
  });

  const selectIcon = (iconType) => {
    if (!editor || !clickedRange) return;
    editor.commands.deleteRange(clickedRange);
    editor.commands.setCallout({ type: iconType });
    setModalVisible(false);
  };

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'textEditor',
      },
      handleClick(view, pos, event) {
        const target = event.target;
        if (target.classList.contains('breadcrumb-segment')) {
          handleBreadcrumbClick(event);
          return true;
        }
        if (target.classList.contains('linked-page')) {
          handleLinkedPageClick(event);
          return true;
        }
        return false;
      },
      handleClickOn(view, pos, node, nodePos, event) {
        if (node.type.name === 'callout') {
          setClickedRange({ from: nodePos, to: nodePos + node.nodeSize });

          // Position the modal relative to the clicked callout
          const iconContainer = event.target.closest('.callout-container');
          if (iconContainer) {
            const rect = iconContainer.getBoundingClientRect();
            setModalPosition({
              top: rect.top + window.scrollY + rect.height, // Position below the callout
              left: rect.left + window.scrollX, // Align with the callout
            });
            setModalVisible(true);
          }

          return true; // Stop further event propagation
        }
        return false;
      },

      handleKeyDown(view, event) {
        if (event.key === '/') {
          event.preventDefault();
          const { from } = view.state.selection;
          const textBeforeSlash = view.state.doc.textBetween(
            from - 1,
            from,
            ' '
          );
          if (textBeforeSlash === '/') {
            view.dispatch(view.state.tr.delete(from - 1, from));
          }
          const selection = window.getSelection();
          const container = document.querySelector('.textEditorContainer');
          const containerRect = container.getBoundingClientRect();
          const containerOffsetLeft = containerRect.left;
          const editorPaddingTop =
            parseFloat(window.getComputedStyle(container).paddingTop) || 0;

          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.top === 0 && rect.left === 0) {
              const caretRect = view.coordsAtPos(
                view.state.selection.$from.pos
              );
              setSlashMenuPosition({
                top:
                  caretRect.top +
                  window.scrollY -
                  containerRect.top -
                  editorPaddingTop +
                  30,
                left: containerRect.left - containerOffsetLeft + window.scrollX,
              });
            } else {
              setSlashMenuPosition({
                top:
                  rect.bottom +
                  window.scrollY -
                  editorPaddingTop -
                  containerRect.top,
                left: rect.left - containerOffsetLeft + window.scrollX,
              });
            }

            setShowSlashMenu(true);
          }
        }
        if (event.key === 'Escape') {
          setShowSlashMenu(false);
          setSearchQuery('');
        }
        return false;
      },
      handleDOMEvents: {
        input(view) {
          const { from } = view.state.selection;
          const textBefore = view.state.doc.textBetween(from - 1, from, ' ');

          if (textBefore !== '/') {
            setShowSlashMenu(false);
          }
        },
      },
    },
    extensions: [
      Video,
      StarterKit,
      Breadcrumb,
      LinkedPage,
      Blockquote,
      Underline,
      Highlight,
      Image,
      CodeBlock,
      Dropcursor,
      HorizontalRule,
      TextStyle,
      TaskList,
      Typography,
      ImageResize,
      CalloutExtension,
      LinkedPages,
      TaskItem.configure({
        nested: true,
        itemTypeName: 'taskItem',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Text,
      Placeholder.configure({
        placeholder: `Write something, type '/' for commands...`,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
      ...(isEndpoint
        ? []
        : provider && ydoc
          ? [
              CollaborationCursor.configure({
                provider,
                user: {
                  name: currentUser?.name || 'Anonymous',
                  color: getRandomColor(),
                },
              }),
              Collaboration.configure({
                document: ydoc,
              }),
            ]
          : []),
      TableRow,
      TableCell,
      TableHeader,
      NonEditableLink.configure({
        linkOnPaste: true,
        openOnClick: true,
        autolink: false,
      }),
    ],
    ...(isEndpoint ? { content: initial } : {}),
    onUpdate: ({ editor }) => {
      if (isEndpoint) {
        const html = editor.getHTML();
        if (typeof onChange === 'function') {
          onChange(html);
          localStorage.setItem('editorContent', html);
        }
      }
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (editor && initial !== editor.getHTML()) {
      editor.commands.setContent(initial, false);
    }
  }, [initial, editor, isEndpoint]);

  return isLoading ? (
    <PageLoader />
  ) : (
    <div
      className={`textEditorContainer ${!isInlineEditor ? 'editor border border-0' : ''}`}
    >
      {editor && (
        <BubbleMenuComponent
          editor={editor}
          pathData={pathData}
          pathName={pathName}
          loading={loading}
          setLoading={setLoading}
          showImage={showImage}
          setShowImage={setShowImage}
          showVideo={showVideo}
          setShowVideo={setShowVideo}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
        />
      )}

      {editor && (
        <FloatingMenuComponent
          editor={editor}
          pathData={pathData}
          pathName={pathName}
          showImage={showImage}
          setShowImage={setShowImage}
          showVideo={showVideo}
          setShowVideo={setShowVideo}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
        />
      )}

      {showSlashMenu && (
        <ShowSlashMenuComponent
          editor={editor}
          pathData={pathData}
          pathName={pathName}
          showSlashMenu={showSlashMenu}
          setShowSlashMenu={setShowSlashMenu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeSlashMenuIndex={activeSlashMenuIndex}
          setActiveSlashMenuIndex={setActiveSlashMenuIndex}
          slashMenuPosition={slashMenuPosition}
          showImage={showImage}
          setShowImage={setShowImage}
          showVideo={showVideo}
          setShowVideo={setShowVideo}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
        />
      )}

      <EditorContent
        editor={editor}
        onClick={(event) => {
          if (!event.target.classList.contains('callout-icon')) {
            setModalVisible(false);
          }
        }}
      />
      {showSlashMenu && (
        <ShowSlashMenuComponent
          editor={editor}
          pathData={pathData}
          pathName={pathName}
          showSlashMenu={showSlashMenu}
          setShowSlashMenu={setShowSlashMenu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeSlashMenuIndex={activeSlashMenuIndex}
          setActiveSlashMenuIndex={setActiveSlashMenuIndex}
          slashMenuPosition={slashMenuPosition}
          showImage={showImage}
          setShowImage={setShowImage}
          showVideo={showVideo}
          setShowVideo={setShowVideo}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
          showModal={showModal}
          setShowModal={setShowModal}
          linkedPage={linkedPage}
          setLinkedPage={setLinkedPage}
        />
      )}

      {showModal && (
        <LinkedPageModal
          setShowModal={setShowModal}
          editor={editor}
          linkedPage={linkedPage}
          setLinkedPage={setLinkedPage}
        />
      )}

      {modalVisible && (
        <div
          className='icon-modal position-fixed rounded border p-2 bg-white d-block'
          style={{
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {Object.entries(icons).map(([type, icon]) => (
            <div
              key={type}
              className='icon-modal-item cursor-pointer d-flex align-items-center py-2 px-3'
              onClick={() => selectIcon(type)}
            >
              {icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
