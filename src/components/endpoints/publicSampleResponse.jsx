import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import { willHighlight, getHighlightsData } from './highlightChangesHelper';
import './endpoints.scss';
import { Style } from 'react-style-tag';
import { hexToRgb } from '../common/utility';
import { background } from '../backgroundColor.js';
class PublicSampleResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: {
        publicCollectionTheme: this.props.publicCollectionTheme,
        backgroundStyle: {},
      },
      isExpanded: false,
      maxHeight: 300,
    };
  }

  componentDidMount() {
    this.updateBackgroundStyle();
  }

  updateBackgroundStyle() {
    const { publicCollectionTheme } = this.state.theme;
    const dynamicColor = hexToRgb(publicCollectionTheme, 0.02);
    const staticColor = background['background_boxes'];

    const backgroundStyle = {
      backgroundImage: `
        linear-gradient(to right, ${dynamicColor}, ${dynamicColor}),
        linear-gradient(to right, ${staticColor}, ${staticColor})
      `,
    };

    this.setState((prevState) => ({
      theme: {
        ...prevState.theme,
        backgroundStyle,
      },
    }));
  }
  showJSONPretty(data) {
    return <JSONPretty data={data} />;
  }

  showSampleResponseBody(data) {
    if (typeof data === 'object') {
      return this.showJSONPretty(data);
    } else {
      try {
        data = JSON.parse(data);
        return this.showJSONPretty(data);
      } catch (err) {
        return <pre>{data}</pre>;
      }
    }
  }
  groupByStatus() {
    const groupedResponses = this.props.sample_response_array.reduce(
      (acc, curr) => {
        if (!acc[curr.status]) {
          acc[curr.status] = [];
        }
        acc[curr.status].push(curr);
        return acc;
      },
      {}
    );
    return groupedResponses;
  }

  render() {
    const { maxHeight } = this.state;
    const groupedResponses = this.groupByStatus();
    return (
      <>
        <Style>
          {`
          .sample-response nav.nav.nav-tabs a.active {
            background: ${this.props.publicCollectionTheme};
            color:#fff;
            opacity: 0.9;
          }

          .overflow-auto {
            scrollbar-color: rgb(0 0 0 / 21%) #f1f1f1; 
            scrollbar-width: thin; 
          }
          `}
        </Style>
        <div className='pubSampleResponse'>
          <div className='heading-2 pt-1 mt-4 font-14 mb-2'>
            <span>
              Sample Response{' '}
              {willHighlight(this.props, 'sampleResponse') ? (
                <i className='fas fa-circle' />
              ) : null}
            </span>
          </div>
          <div
            className='sample-response mb-1'
            style={this.state.theme.backgroundStyle}
          >
            <Tabs id='uncontrolled-tab-example' aria-hidden='true'>
              {Object.keys(groupedResponses).map((status, key) => (
                <Tab
                  key={key}
                  eventKey={status}
                  title={
                    getHighlightsData(this.props, 'sampleResponse', status) ? (
                      <span>
                        {status}
                        <i className='fas fa-circle' />
                      </span>
                    ) : (
                      status
                    )
                  }
                >
                  {groupedResponses[status].map((sampleResponse, idx) => (
                    <div key={idx}>
                      <div>{sampleResponse.description}</div>
                      <div>
                        {this.showSampleResponseBody(sampleResponse.data)}
                      </div>
                      {idx < groupedResponses[status]?.length - 1 && <hr />}
                    </div>
                  ))}
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

export default PublicSampleResponse;
