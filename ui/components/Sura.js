import React, { PropTypes, Component } from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

function convertDigitIn(enDigit){ // PERSIAN, ARABIC, URDO
    var newValue="";
    for (var i=0;i<enDigit.length;i++)
    {
        var ch=enDigit.charCodeAt(i);
        if (ch>=48 && ch<=57)
        {
            // european digit range
            var newChar=ch+1584;
            newValue=newValue+String.fromCharCode(newChar);
        }
        else
            newValue=newValue+String.fromCharCode(ch);
    }
    return newValue;
}

function Loading() {
  return (
    <div>Loading...</div>
  );
}

class surahFull extends Component {
  constructor() {
    super();
    this.state = {
      lastRead: null,
    }
  }

  render() {
    const styles = require('./Sura.less');
    const { data } = this.props;
    const boundClick = this.addLastRead.bind(this);
    return (
      <div>
        {data.loading ? <Loading /> :
          <section>
            <nav className="qh-navbar"><Link className="qh-nav-right" to="/">Quran Hub Clone</Link>{data.sura._id}) {data.sura.title} | Terakhir dibaca : {this.state.lastRead ?
               <a href={`/sura/${this.state.lastRead}`}>{this.state.lastRead}</a> : "Click Arabic Text"}</nav>
            <div className="qh-sura">
            {data.sura.ayah.map(function(aya) {
              const isArabic = aya._language === 1;
              
              return ( 
                <ul key={aya._id}>
                  <p id={isArabic? aya.verse : null}
                    onClick={boundClick}
                    className={isArabic? "arab": "latin"}>
                    {isArabic? convertDigitIn(aya.verse.toString()) : aya.verse}) {aya.ayah_text.replace(/&quot;/g,'"')}
                  </p>  
                </ul>
              )
            })}
            </div>
          </section>}
      </div>
    );
  }
  addLastRead(e) {
    const { data } = this.props;
    this.setState({ lastRead: data.sura._id + '#' + e.target.getAttribute('id') });
  }
}

surahFull.propTypes = {
  data: React.PropTypes.object,
}

function mapQueriesToProps(props) {
  const { sura_id } = props.ownProps.params;
  return {
    data: {
      query: gql`
        query RootQuery {
          sura (id: "${sura_id}") {
            _id
            title
            ayah {
              _id
              verse
              _language
              _sura
              ayah_text
            }
          }
        }
      `,
      forceFetch: false,
      returnPartialData: false
    }
  }
}

const Sura = connect({
  mapQueriesToProps
})(surahFull);

export default Sura;