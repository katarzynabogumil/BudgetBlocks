import { app } from './index';

const PORT = parseInt(process.env.PORT || '', 10);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
