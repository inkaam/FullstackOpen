import { useNavigate } from 'react-router-dom';
import { useField, useAnecdotes } from '../hooks';

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes();
  const { onReset: onResetContent, ...content } = useField('text');
  const { onReset: onResetAuthor, ...author } = useField('text');
  const { onReset: onResetInfo, ...info } = useField('text');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate('/');
  };

  const handleReset = (e) => {
    e.preventDefault();
    onResetContent();
    onResetAuthor();
    onResetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input {...content} />
        </div>
        <div>
          author <input {...author} />
        </div>
        <div>
          url for more info <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
