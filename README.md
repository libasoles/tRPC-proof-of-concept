# Recruiting exercise

## Tasks

- list candidates
- configurable table columns
- edit rejection reasons

Using any preferred stack. And designing the UX and basic look and feel.

### Bonus

I came up with:

- search filters (with debounce)
- pagination

Plus the usual status indications:

- loading message
- no results message
- error message

## Technologies

Mainly:

- React
- Node w/express
- Typescript in both sides
- tRPC

Tested with:

- Jest
- React testing library
- msw (mock server)

Utils:

- React Query

## Demo

### Filters

- Debounced search field (only filters by name for now).
- Checkbox to display only approved candidates.
- There's a message indicating that there's no results.

https://user-images.githubusercontent.com/8009070/234359162-fafe906f-beb2-4b22-91c3-b2cb227ae73f.mov

### Paginated list

- Navigate results.
- Arrows disable on first and last page.

https://user-images.githubusercontent.com/8009070/234361436-a4c648a6-1a40-4dc5-9652-d3afacdd814f.mov

### Edit Candidate status

- Edit button in rejection reasons columns.
- Modal box to select or deselect rejection reasons.
- The list updates when the modal closes.

https://user-images.githubusercontent.com/8009070/234359475-8c04f37a-bdec-41b2-b326-c9ad6f7da57a.mov

### Config table columns

There's no UI for this, but you can configure the columns you want to display.

https://user-images.githubusercontent.com/8009070/234361545-dafd9a29-f1cf-4f9e-91dc-1258b3107e82.mov

### Error screen

- There's a loading message during retries.
- Display an error message if server fails.

https://user-images.githubusercontent.com/8009070/234359625-e67debe0-bc90-487a-8afd-8b8acc227200.mov



