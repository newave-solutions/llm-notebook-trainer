# Database Setup Instructions

## Quick Setup

Copy the entire SQL code from `supabase/migrations/20250101000000_initial_schema.sql` and run it in your Supabase SQL Editor.

## What Gets Created

### Tables

1. **profiles**
   - Links to Supabase auth.users
   - Stores user profile information
   - Auto-created when users sign up

2. **projects**
   - Stores AI training projects
   - Contains model selection and configuration
   - Status tracking (draft, training, completed, failed)
   - JSON settings for model parameters

3. **notebook_cells**
   - Interactive code/markdown cells
   - Linked to projects
   - Maintains cell order with position field

4. **training_sessions**
   - Tracks training runs
   - Progress monitoring
   - Token usage and cost estimation
   - Error logging

5. **training_results**
   - Stores training outputs
   - Input/output pairs
   - Quality scoring
   - Token usage per result

### Security (RLS Policies)

All tables have Row Level Security enabled with policies that ensure:

- Users can only view their own data
- Users can only modify their own data
- Authenticated users required for all operations
- Cascading deletes maintain data integrity

### Automatic Features

- **UUID Generation**: All IDs are auto-generated UUIDs
- **Timestamps**: Created/updated timestamps on all tables
- **Profile Creation**: Automatic profile creation on user signup via trigger
- **Indexes**: Performance indexes on foreign keys and frequently queried fields

## Verification

After running the migration, verify by checking:

1. Tables exist in the Table Editor
2. RLS is enabled (green shield icon)
3. Policies are listed for each table
4. Trigger function exists: `handle_new_user()`

## Testing Authentication

1. Sign up a new user through the app
2. Check the profiles table - a profile should be auto-created
3. Create a project - it should appear in the projects table
4. Verify you can only see your own data

## Common Issues

### "relation does not exist"
- The migration hasn't been run yet
- Run the SQL in the Supabase dashboard

### "permission denied"
- RLS is enabled but policies are missing
- Re-run the migration to create policies

### "no rows returned"
- Check if you're signed in
- Verify the user_id matches auth.uid()

## Support

If you encounter issues, check:
- Supabase project is active
- Environment variables are correct
- User is authenticated before accessing data
