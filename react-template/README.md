tailwindcss 
react-redux
react-router-dom




## sample redux
```
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './features/counter/counterSlice';

function App() {
const count = useSelector((state) => state.counter.value);
const dispatch = useDispatch();

return (
<div>
<p>Count: {count}</p>
<button onClick={() => dispatch(increment())}>+</button>
<button onClick={() => dispatch(decrement())}>-</button>
</div>
);
}
```

## sample api response
```
import React, { useState } from 'react';
import ApiResponse from './ApiResponse';

function MyComponent() {
const [response, setResponse] = useState(new ApiResponse());

const fetchData = async () => {
const apiResponse = new ApiResponse();
setResponse(apiResponse.setLoading());

    try {
      const result = await fetch('https://api.example.com/data');
      const data = await result.json();
      setResponse(apiResponse.setSuccess(data));
    } catch (error) {
      setResponse(apiResponse.setError('Failed to fetch data.'));
    }
};

return (
<div>
<button onClick={fetchData}>Fetch Data</button>

      {response.isLoading && <p>Loading...</p>}
      {response.isSuccess && <pre>{JSON.stringify(response.data, null, 2)}</pre>}
      {response.isError && <p>{response.errorMessage}</p>}
    </div>
);
}

```
