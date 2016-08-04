import React from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

function Loading() {
  return (
    <div>Loading...</div>
  );
}

function surahList(props) {
  if (props.data.loading) {
    return <Loading />;
  }
  return (
    <div>
      <section>
        <nav className="qh-navbar">Quran Hub Clone</nav>
        {props.data.allSura.map(function(sura) {
          return (
            <ul key={sura._id}>
              <Link to={`/sura/${sura._id}`}>{sura._id}) {sura.title}</Link>
            </ul>
          )
        })}
      </section>
    </div>
  );
}

function mapQueriesToProps() {
  return {
    data: {
      query: gql`
        query RootQuery {
          allSura {
            _id
            title
          }
        }
      `,
      forceFetch: false,
      returnPartialData: false
    }
  }
}

const Quran = connect({
  mapQueriesToProps
})(surahList);

export default Quran;