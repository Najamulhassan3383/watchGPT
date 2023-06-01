import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image, FlatList, Linking, VirtualizedList } from "react-native";
import { Text } from "react-native-paper";
import { primaryColor, secondaryColor } from "../../../colors";
import FontAwsome from "react-native-vector-icons/FontAwesome";
import { useRoute, useNavigation } from '@react-navigation/native';
import useMovieData from "../../../customHooks/useMovieData";
import { getDetails, getActors, getRecommendations } from "../../API/api";
import MovieList from "../../MoviesList";
import MoviesListContainer from "../../MoviesListContainer";

function MovieDetail({ navigation, route }) {

  const [loading, setLoading] = useState(false);
  const [moviesData, setMoviesData] = useState(route.params.movie);

  const getCompleteMovieData = async (movie) => {
    try {
      const movieData = {
        ...movie,
        runtime: 0,
        cast: [],
        recommended: [],
      };

      const [details, cast, recommendedMovies] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieCast(movie.id),
        getMovieRecommendations(movie.id),
      ]);

      if (details) {
        movieData.runtime = details.runtime;
        movieData.genres = details.genres;
      }

      if (cast) {
        movieData.cast = cast.cast.slice(0, 5);
      }

      if (recommendedMovies) {
        movieData.recommended = recommendedMovies.slice(0, 5).map((recommendedMovie) => ({
          title: recommendedMovie.original_title,
          id: recommendedMovie.id,
          overview: recommendedMovie.overview,
          poster: `https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/w500${recommendedMovie.backdrop_path}`,
          rating: recommendedMovie.vote_average.toFixed(1),
          release: recommendedMovie.release_date.slice(0, 4),
          genres: recommendedMovie.genre_ids,
          language: recommendedMovie.original_language,
        }));
        (movieData.recommended)
      }

      return movieData;
    } catch (error) {
      console.log(error);
    }

  };


  const getMovieDetails = async (movieId) => {
    setLoading(true);
    try {
      const movie = await getDetails(movieId);
      setLoading(false);
      return movie;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return null;
    }
  };

  const getMovieCast = async (movieId) => {
    setLoading(true);
    try {
      const cast = await getActors(movieId);
      setLoading(false);
      return cast;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return null;
    }
  };

  const getMovieRecommendations = async (movieId) => {
    setLoading(true);
    try {
      const recommendations = await getRecommendations(movieId);
      setLoading(false);
      // console.log(recommendations)
      return recommendations;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    const getMovieData = async () => {
      const movieData = await getCompleteMovieData(route.params.movie);
      // console.log(movieData)
      setMoviesData(movieData);
    }

    getMovieData();
  }, [route.params.movie]);

  if (loading) {
    return (
      <Text >Loading...</Text>
    );
  }

  return (
    <ScrollView style={{ marginBottom: 40 }}>
      <View style={styles.movieContainer}>

        <View style={styles.moviePoster}>
          <Image
            source={{ uri: moviesData.poster }}
            style={styles.movieImage}
          />
        </View>

        <View style={styles.overlay}>
          <Text style={styles.movieTitle}>{moviesData.title}</Text>
          <Text style={styles.movieYear}>{moviesData.release}</Text>
          <Text style={styles.movieRating}>{moviesData.rating}
            <FontAwsome name="star" size={25} color="#FFD700" />
          </Text>
          <View style={styles.movieGenre}>
            {moviesData.genres.map((genre, index) => (
              <Text key={index} style={styles.movieGenreText}>{genre.name}</Text>
            ))}

          </View>
        </View>
      </View>
      <View style={styles.movieDetails}>
        <Text style={styles.About}>About Movie</Text>
        <Text style={styles.movieDescription}>
          {moviesData.overview}
        </Text>
      </View>
      <View style={styles.border}></View>
      <View style={styles.movieCast}>
        <Text style={styles.movieCastTitle}>Cast</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={moviesData.cast}
          renderItem={({ item }) => (
            <View style={styles.FlatContainer}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }}
                style={styles.movieCastImageContainer}
              />
              <Text style={styles.castName}>{item.name}</Text>
              <Text style={styles.castName}>{item.character}</Text>
            </View>
          )}
          horizontal={true}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <Text style={styles.movieCastTitle}>Recommended</Text>
      <MovieList moviesData={moviesData.recommended} />

    </ScrollView>
  );
}

export default MovieDetail;

const styles = StyleSheet.create({
  border: {
    borderWidth: 0.5,
    borderColor: primaryColor,
    marginHorizontal: 10,
  },
  FlatContainer: {
    backgroundColor: primaryColor,
    padding: 10,
    margin: 10,
    borderRadius: 6,
  },
  movieCast: {
    padding: 10,
    marginBottom: 20,
  },
  castName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
    color: secondaryColor,
  },
  movieCastTitle: {
    color: secondaryColor,
    fontSize: 26,
    fontWeight: "bold",
  },
  movieCastImageContainer: {
    width: 100,
    height: 130,
    alignSelf: "center",
  },
  movieContainer: {
    marginTop: 20,
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 10,
  },
  movieImage: {
    marginTop: 20,
    height: 450,
    width: 450,
  },
  overlay: {
    position: "absolute",
    top: 333,
    left: 30,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  movieYear: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  movieRating: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  movieDetails: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  movieGenre: {
    flexDirection: "row",
    marginTop: 10,
  },
  movieGenreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: secondaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    opacity: 0.6,
  },
  About: {
    marginTop: 60,
    color: secondaryColor,
    fontSize: 26,
    fontWeight: "bold",
  },
  movieDescription: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "justify",
  },
});
