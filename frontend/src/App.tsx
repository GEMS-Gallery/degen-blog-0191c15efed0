import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1642239817413-692565098d33?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjU1MjYxNjl8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setSubmitting(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      reset();
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="md">
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Share your thoughts on the world of cryptocurrency
        </Typography>
      </HeroSection>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <Typography variant="h4" gutterBottom>
          Create New Post
        </Typography>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="body"
          control={control}
          defaultValue=""
          rules={{ required: 'Body is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Body"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="author"
          control={control}
          defaultValue=""
          rules={{ required: 'Author is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Author"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={submitting && <CircularProgress size={20} color="inherit" />}
        >
          {submitting ? 'Submitting...' : 'Submit Post'}
        </Button>
      </form>

      <Typography variant="h4" gutterBottom>
        Recent Posts
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <StyledCard key={post.id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body2" component="p">
                {post.body}
              </Typography>
            </CardContent>
          </StyledCard>
        ))
      )}
    </Container>
  );
}

export default App;
